import { Link, useParams } from "react-router-dom";
import { Col, Container, Form, Row, Tab, Table, Tabs } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Vehicle } from "./VehicleListPage";
import { SERVER_URL } from "../constants/constants";

interface ParkingHistory {
    sessionId: number;
    startTime: string;
    isActive: boolean;
    allottedTime: number;
    isCharging: boolean;
    parkingLotId: number;
    parkingLotAddress: string; // postalCode city, Province eg. "V6T 1Z4 Vancouver, BC"
    vehicleLicensePlate: string;
    spotId: number;
    spotType: string;
    accessibilityType?: string;
    isAccessibilitySpot: boolean;
    isElectricSpot: boolean;
}

interface TicketHistory {
    vehicleLicensePlate: string;
    ticketNumber: number;
    dateReceived: string;
    paid: boolean;
    cost: number;
    details?: string;
}

interface Summary {
    parkingLotId: number;
    parkingLotAddress: string; // postalCode city, Province eg. "V6T 1Z4 Vancouver, BC"
    vehicleLicensePlate: string;
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
        label: "Ticket Number",
        value: "t.ticketNumber"
    }, {
        label: "Session ID",
        value: "p.sessionId"
    }, {
        label: "Details",
        value: "t.details"
    }]
    const [ticketCols, setTicketCols] = useState([
        "t.ticketNumber",
        "t.details"
    ])
    const parkingColsArray = [{
        label: "Allotted Time",
        value: "p.allottedTime"
    }, {
        label: "Charging used?",
        value: "p.isCharging"
    }, {
        label: "Session ID",
        value: "p.sessionID"
    }, {
        label: "Spot ID",
        value: "p.spotID"
    }, {
        label: "Spot Type",
        value: "p.spotType"
    }]
    const [parkingCols, setParkingCols] = useState([
        "p.allottedTime",
        "p.isCharging",
        "p.spotType"
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
                promises.push(await fetch(summaryUrl, {
                    method: "GET",
                    credentials: "include"
                }))
                historyUrl.searchParams.append("attr", `[${parkingCols.join(",")}]`)
                promises.push(await fetch(historyUrl, {
                    method: "GET",
                    credentials: "include"
                }))
                ticketUrl.searchParams.append("attr", `[${ticketCols.join(",")}]`)
                promises.push(await fetch(ticketUrl, {
                    method: "GET",
                    credentials: "include"
                }))
                if (licensePlate) {
                    promises.push(await fetch(SERVER_URL + "/api/vehicle?licensePlate=" + licensePlate, {
                        method: "GET",
                        credentials: "include"
                    }))
                    promises.push(await fetch(SERVER_URL + "/api/numTickets/" + licensePlate, {
                        method: "GET",
                        credentials: "include"
                    }))
                    promises.push(await fetch(SERVER_URL + "/api/totalCost/" + licensePlate, {
                        method: "GET",
                        credentials: "include"
                    }))
                }
                const responses = await Promise.all(promises);
                const json = await Promise.all(responses.map(response => response.json()));
                console.log(json)
                if (!responses[0].ok) {
                    alert("Vehicle not found");
                } else {
                    const summary = await responses[0].json();
                    setSummary(summary);
                }
                if (!responses[1].ok) {
                    alert("Summary not found");
                } else {
                    const history = await responses[1].json();
                    setParkingHistory(history);
                }
                if (!responses[2].ok) {
                    alert("Parking history not found");
                } else {
                    const tickets = await responses[2].json();
                    setTicketHistory(tickets);
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
                        const numTickets = await responses[4].json();
                        setNumTickets(numTickets);
                    }
                    if (!responses[5].ok) {
                        alert("Total cost not found");
                    } else {
                        const totalCost = await responses[5].json();
                        setTotalCost(totalCost);
                    }
                }
            } catch (e) {
                console.error(e);
                alert("Failed to fetch vehicles");
            }
        }
        // TODO: uncomment this line
        // fetchData();
    }, [licensePlate]);

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
                                                    <th>Allotted Time (mins)</th>
                                                    <th>Charging used?</th>
                                                    <th>Parking Lot</th>
                                                    <th>Parking Lot Address</th>
                                                    <th>Spot Number</th>
                                                    <th>Spot Type</th>
                                                    <th>Accessibility Type</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {parkingHistory.map((elem) => (
                                                    <tr
                                                        key={elem.sessionId}
                                                    >
                                                        {!licensePlate && (
                                                            <td>
                                                                <Link
                                                                    to='/vehicles'>{elem.vehicleLicensePlate}</Link>
                                                            </td>
                                                        )}
                                                        <td>{elem.sessionId}</td>
                                                        <td>{elem.startTime.split('T')[0]}</td>
                                                        <td>{elem.startTime.split('T')[1]}</td>
                                                        <td>{elem.isActive ? 'Yes' : 'No'}</td>
                                                        <td>{elem.allottedTime}</td>
                                                        <td>{elem.isElectricSpot ? elem.isCharging ? 'Yes' : 'No' : '-'}</td>
                                                        <td>{elem.parkingLotId}</td>
                                                        <td>{elem.parkingLotAddress}</td>
                                                        <td>{elem.spotId}</td>
                                                        <td>{elem.spotType}</td>
                                                        <td>{elem.isAccessibilitySpot ? elem.accessibilityType : '-'}</td>
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
                                                    <th>Date Received</th>
                                                    <th>Time Received</th>
                                                    <th>Paid?</th>
                                                    <th>Amount ($)</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {ticketHistory.map((ticket) => (
                                                    <tr
                                                        key={ticket.ticketNumber}
                                                    >
                                                        {!licensePlate && (
                                                            <td>
                                                                <Link to='/vehicles'>{ticket.vehicleLicensePlate}</Link>
                                                            </td>
                                                        )}
                                                        <td>{ticket.ticketNumber}</td>
                                                        <td>{ticket.dateReceived.split('T')[0]}</td>
                                                        <td>{ticket.dateReceived.split('T')[1]}</td>
                                                        <td>{ticket.paid ? 'Yes' : 'No'}</td>
                                                        <td>{ticket.cost}</td>
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
                                                    key={elem.parkingLotId + elem.vehicleLicensePlate}
                                                >
                                                    {!licensePlate && (
                                                        <td>
                                                            <Link to='/vehicles'>{elem.vehicleLicensePlate}</Link>
                                                        </td>
                                                    )}
                                                    <td>{elem.parkingLotId}</td>
                                                    <td>{elem.parkingLotAddress}</td>
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