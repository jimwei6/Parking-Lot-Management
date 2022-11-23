import { Link, useParams } from "react-router-dom";
import { Col, Container, Form, Row, Tab, Table, Tabs } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Vehicle } from "./VehicleListPage";
import { SERVER_URL } from "../constants/constants";

interface ParkingHistory {
    sessionid: number;
    starttime: string;
    isactive: boolean;
    allottedtime: number;
    ischarging: boolean;
    parkinglotid: number;
    parkinglotaddress: string; // postalCode city, Province eg. "V6T 1Z4 Vancouver, BC"
    vehiclelicenseplate: string;
    spotid: number;
    spottype: string;
    accessibilitytype?: string;
    isaccessibilityspot: boolean;
    iselectricspot: boolean;
}

interface TicketHistory {
    licenseplate: string;
    ticketnumber: number;
    datereceived: string;
    sessionid: number;
    paid: boolean;
    cost: number;
    details?: string;
}

interface Summary {
    parkinglotid: number;
    parkinglotaddress: string; // postalCode city, Province eg. "V6T 1Z4 Vancouver, BC"
    vehiclelicenseplate: string;
    count: number;
}

export const ParkingHistoryPage = () => {
    const { licensePlate } = useParams();
    const [vehicle, setVehicle] = useState<Vehicle>();
    const [parkingHistory, setParkingHistory] = useState<ParkingHistory[]>([]);
    const [ticketHistory, setTicketHistory] = useState<TicketHistory[]>([]);
    const [totalCost, setTotalCost] = useState(0);
    const [numTickets, setNumTickets] = useState(0);
    const [summary, setSummary] = useState<Summary[]>([]);
    const ticketColsArray = [{
        label: "Session ID",
        value: "p.sessionId"
    }, {
        label: "Details",
        value: "t.details"
    }, {
      label:"Cost",
      value:"t.cost"
    }]
    const [ticketCols, setTicketCols] = useState([
        "t.details"
    ])
    const parkingColsArray = [{
        label: "Allotted Time",
        value: "p.allottedTime"
    }, {
        label: "Charging used?",
        value: "p.isCharging"
    }, {
        label: "Spot ID",
        value: "p.spotID"
    }, {
        label: "Spot Type",
        value: "ps.spotType"
    }]
    const [parkingCols, setParkingCols] = useState([
        "p.allottedTime",
        "p.isCharging",
        "ps.spotType"
    ])

    useEffect(() => {
        // TODO: store fetched data in state
        const fetchData = async () => {
            try {
                const promises = []
                const summaryUrl = new URL(`${SERVER_URL}/api/summary`);
                const historyUrl = new URL(`${SERVER_URL}/api/parkingHistory`);
                const ticketUrl = new URL(`${SERVER_URL}/api/ticketHistory`);
                if (licensePlate) {
                    summaryUrl.searchParams.append("licensePlate", licensePlate);
                    historyUrl.searchParams.append("licensePlate", licensePlate);
                    ticketUrl.searchParams.append("licensePlate", licensePlate);
                }
                promises.push(fetch(summaryUrl, {
                    method: "GET",
                    credentials: "include"
                }))
                historyUrl.searchParams.append("attr", JSON.stringify(parkingCols))
                promises.push(fetch(historyUrl, {
                    method: "GET",
                    credentials: "include"
                }))
                ticketUrl.searchParams.append("attr", JSON.stringify(ticketCols))
                promises.push(fetch(ticketUrl, {
                    method: "GET",
                    credentials: "include"
                }))
                if (licensePlate) {
                    promises.push(fetch(SERVER_URL + "/api/vehicle?licensePlate=" + licensePlate, {
                        method: "GET",
                        credentials: "include"
                    }))
                    promises.push(fetch(SERVER_URL + "/api/numTickets/" + licensePlate, {
                        method: "GET",
                        credentials: "include"
                    }))
                    promises.push(fetch(SERVER_URL + "/api/totalCost/" + licensePlate, {
                        method: "GET",
                        credentials: "include"
                    }))
                }
                const responses = await Promise.all(promises);
                const json = await Promise.all(responses.map(response => response.json()));
                console.log(json)
                if (!responses[0].ok) {
                  alert("Summary not found");
                } else {
                    const summary = json[0];
                    setSummary(summary.result);
                }
                if (!responses[1].ok) {
                    alert("Parking history not found");
                } else {
                    const history = json[1];
                    setParkingHistory(history.result);
                }
                if (!responses[2].ok) {
                    alert("Ticket history not found");
                } else {
                    const tickets = json[2];
                    setTicketHistory(tickets.result);
                }
                if (licensePlate) {
                    if (!responses[3].ok) {
                        alert("Vehicle not found");
                    } else {
                        const vehicle = json[3].result.find((vehicle: any) => vehicle.licenseplate === licensePlate);
                        const permits = vehicle.permits.filter((permit: any) => permit !== null)
                        setVehicle({
                            ...vehicle,
                            licensePlate: vehicle.licenseplate,
                            plugType: vehicle.plugtype,
                            isElectric: vehicle.iselectric,
                            color: '#' + vehicle.color,
                            permits: permits
                        });
                    }
                    if (!responses[4].ok) {
                        alert("Num Tickets not found");
                    } else {
                        const numTickets = json[4];
                        setNumTickets(numTickets.numtickets);
                    }
                    if (!responses[5].ok) {
                        alert("Total cost not found");
                    } else {
                        const totalCost = json[5];
                        setTotalCost(totalCost.totalcost);
                    }
                }
            } catch (e) {
                console.error(e);
                alert("Failed to fetch vehicles");
            }
        }
        // TODO: uncomment this line
        fetchData();
    }, [licensePlate, parkingCols, ticketCols]);

    return (
        <Container fluid className="mx-auto">
            <Row className="justify-content-center">
                <Col xs md="12" lg="12" className="align-items-center">
                    {licensePlate && (
                        <Row xs={1} xl={2} className="pb-4">
                            <Col>
                                <h3>{licensePlate}</h3>
                                <h5 className="text-muted">{vehicle?.model}</h5>
                                <Row>
                                    <Col>
                                        <h6>Height: {vehicle?.height} mm</h6>
                                        <h6>Color: {vehicle?.color}</h6>
                                    </Col>
                                    <Col>
                                        {vehicle?.isElectric && <h6>Plug Type: {vehicle?.plugType}</h6>}
                                        <h6>Permits: {vehicle?.permits.join(', ') || 'none'}</h6>
                                    </Col>
                                    <Col>
                                        <h6># of tickets: {numTickets}</h6>
                                        <h6>Total cost of tickets: ${totalCost}</h6>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    )}
                    <Row className="pb-4">
                        <Col>
                            <Tabs
                                defaultActiveKey="Parking"
                                transition={false}
                                className="mb-3"
                            >
                                <Tab eventKey="Parking" title="Parking History">
                                    <Row xs={1}>
                                        <Form.Group as={Col}>
                                            {parkingColsArray.map(({ label, value }) => (
                                                <Form.Check
                                                    key={value}
                                                    inline
                                                    label={label}
                                                    type="checkbox"
                                                    name="parkingHistoryColumns"
                                                    value={value}
                                                    defaultChecked={parkingCols.includes(value)}
                                                    onChange={() => {
                                                        if (parkingCols.includes(value)) {
                                                            setParkingCols(parkingCols.filter(col => col !== value));
                                                        } else {
                                                            setParkingCols([...parkingCols, value]);
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Form.Group>
                                    </Row>
                                    {parkingHistory.length > 0 ? (
                                        <Row xs={1}>
                                            <Table bordered responsive>
                                                <thead>
                                                <tr>
                                                    {!licensePlate && (<th>Vehicle</th>)}
                                                    <th>Session ID</th>
                                                    <th>Start Date</th>
                                                    <th>Start Time</th>
                                                    <th>Active</th>
                                                    {parkingCols.includes('p.allottedTime') && <th>Allotted Time (mins)</th>}
                                                    {parkingCols.includes('p.isCharging') && <th>Charging used?</th>}
                                                    <th>Parking Lot</th>
                                                    <th>Parking Lot Address</th>
                                                    {parkingCols.includes('p.spotID') && <th>Spot Number</th>}
                                                    {parkingCols.includes('ps.spotType') && <th>Spot Type</th>}
                                                    <th>Accessibility Type</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {parkingHistory.map((elem) => (
                                                    <tr
                                                        key={elem.sessionid}
                                                    >
                                                        {!licensePlate && (
                                                            <td>
                                                                <Link
                                                                    to='/vehicles'>{elem.vehiclelicenseplate}</Link>
                                                            </td>
                                                        )}
                                                        <td>{elem.sessionid}</td>
                                                        <td>{elem.starttime.split('T')[0]}</td>
                                                        <td>{elem.starttime.split('T')[1]}</td>
                                                        <td>{elem.isactive ? 'Yes' : 'No'}</td>
                                                        {parkingCols.includes('p.allottedTime') && <td>{elem.allottedtime}</td>}
                                                        {parkingCols.includes('p.isCharging') && <td>{elem.iselectricspot ? elem.ischarging ? 'Yes' : 'No' : '-'}</td>}
                                                        <td>{elem.parkinglotid}</td>
                                                        <td>{elem.parkinglotaddress}</td>
                                                        {parkingCols.includes('p.spotID') && <td>{elem.spotid}</td>}
                                                        {parkingCols.includes('ps.spotType') && <td>{elem.spottype}</td>}
                                                        <td>{elem.isaccessibilityspot ? elem.accessibilitytype : '-'}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </Table>
                                        </Row>
                                    ) : (
                                        <h5 className="text-center py-5">No results</h5>
                                    )}
                                </Tab>
                                <Tab eventKey="Ticket" title="Ticket History">
                                    <Row xs={1}>
                                        <Form.Group as={Col}>
                                            {ticketColsArray.map(({ label, value }) => (
                                                <Form.Check
                                                    key={value}
                                                    inline
                                                    label={label}
                                                    type="checkbox"
                                                    name="ticketHistoryColumns"
                                                    value={value}
                                                    defaultChecked={ticketCols.includes(value)}
                                                    onChange={() => {
                                                        if (ticketCols.includes(value)) {
                                                            setTicketCols(ticketCols.filter(col => col !== value));
                                                        } else {
                                                            setTicketCols([...ticketCols, value]);
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Form.Group>
                                    </Row>
                                    {ticketHistory.length > 0 ? (
                                        <Row xs={1}>
                                            <Table bordered responsive>
                                                <thead>
                                                <tr>
                                                    {!licensePlate && (<th>Vehicle</th>)}
                                                    <th>Ticket Number</th>
                                                    {ticketCols.includes('p.sessionId') && (<th>Session Id</th>)}
                                                    <th>Date Received</th>
                                                    <th>Time Received</th>
                                                    <th>Paid?</th>
                                                    {ticketCols.includes('t.cost') && (<th>Amount ($)</th>)}
                                                    {ticketCols.includes('t.details') && (<th>Details</th>)}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {ticketHistory.map((ticket) => (
                                                    <tr
                                                        key={ticket.ticketnumber}
                                                    >
                                                        {!licensePlate && (
                                                            <td>
                                                                <Link to='/vehicles'>{ticket.licenseplate}</Link>
                                                            </td>
                                                        )}
                                                        <td>{ticket.ticketnumber}</td>
                                                        {ticketCols.includes('p.sessionId') && (<td>{ticket.sessionid}</td>)}
                                                        <td>{ticket.datereceived.split('T')[0]}</td>
                                                        <td>{ticket.datereceived.split('T')[1]}</td>
                                                        <td>{ticket.paid ? 'Yes' : 'No'}</td>
                                                        {ticketCols.includes('t.cost') && (<td>{ticket.cost}</td>)}
                                                        {ticketCols.includes('t.details') && (<td>{ticket.details}</td>)}
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </Table>
                                        </Row>
                                    ) : (
                                        <h5 className="text-center py-5">No results</h5>
                                    )}
                                </Tab>
                                <Tab eventKey="Summary" title="Summary">
                                    <Row xs={1}>
                                        <Table bordered responsive>
                                            <thead>
                                            <tr>
                                                {!licensePlate && (<th>Vehicle</th>)}
                                                <th>Parking Lot ID</th>
                                                <th>Parking Lot Address</th>
                                                <th>Number of times parked</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {summary.map((elem) => (
                                                <tr
                                                    key={elem.parkinglotid + elem.vehiclelicenseplate}
                                                >
                                                    {!licensePlate && (
                                                        <td>
                                                            <Link to='/vehicles'>{elem.vehiclelicenseplate}</Link>
                                                        </td>
                                                    )}
                                                    <td>{elem.parkinglotid}</td>
                                                    <td>{elem.parkinglotaddress}</td>
                                                    <td>{elem.count}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    </Row>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}