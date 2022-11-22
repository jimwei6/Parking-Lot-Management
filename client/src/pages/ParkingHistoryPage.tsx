import { Link, useParams } from "react-router-dom";
import { Col, Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Vehicle } from "./VehicleListPage";

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

    useEffect(() => {
        if (licensePlate) {
            // TODO: Fetch vehicle data from the server
            setVehicle({
                licensePlate: licensePlate,
                model: 'Tesla Model 3',
                height: 1800,
                color: '#FF0000',
                isElectric: true,
                plugType: 'Type 2',
                permits: ['accessibility', 'company', 'vip'],
            })
            // TODO: Fetch parking history from the server (for the given vehicle)
            setParkingHistory([{
                    sessionId: 1,
                    startTime: '2021-04-01T12:00:00',
                    isActive: false,
                    allottedTime: 60,
                    isCharging: true,
                    parkingLotId: 1,
                    parkingLotAddress: 'V6T 1Z4 Vancouver, BC',
                    vehicleLicensePlate: licensePlate,
                    spotId: 1,
                    spotType: 'normal',
                    isAccessibilitySpot: false,
                    isElectricSpot: true,
                }]
            )
            // TODO: Fetch ticket history from the server (for the given vehicle)
            setTicketHistory([{
                ticketNumber: 1,
                dateReceived: '2021-04-01T12:00:00',
                paid: false,
                cost: 100,
                details: 'Parking in a no parking zone',
                vehicleLicensePlate: licensePlate,
            }])
            // TODO: Only exists if licensePlate exists, that is, route is /history/:licensePlate
            setTotalCost(71.5);
            setNumTickets(7);
            // TODO: Fetch summary from the server (for the given vehicle)
            setSummary([{
                parkingLotId: 1,
                parkingLotAddress: 'V6T 1Z4 Vancouver, BC',
                vehicleLicensePlate: licensePlate,
                count: 5,
            }, {
                parkingLotId: 2,
                parkingLotAddress: 'M5T 1Z4 Toronto, ON',
                vehicleLicensePlate: licensePlate,
                count: 20,
            }])
        } else {
            // TODO: Fetch parking history from the server (for all vehicles owned by the user) <= DONE
            setParkingHistory([{
                sessionId: 100,
                startTime: '2022-10-01T12:00:00',
                isActive: false,
                allottedTime: 90,
                isCharging: false,
                parkingLotId: 1,
                parkingLotAddress: 'V6T 1Z4 Vancouver, BC',
                vehicleLicensePlate: 'ABC123',
                spotId: 1,
                spotType: 'vip',
                accessibilityType: 'infant',
                isAccessibilitySpot: true,
                isElectricSpot: false,
            }])
            // TODO: Fetch ticket history from the server (for all vehicles owned by the user) <= DONE
            setTicketHistory([{
                vehicleLicensePlate: 'ABC123',
                ticketNumber: 1,
                dateReceived: '2021-04-01T12:00:00',
                paid: false,
                cost: 100
            }])
            // TODO: Fetch summary from the server (for all vehicles owned by the user) <= DONE
            setSummary([{
                parkingLotId: 10,
                parkingLotAddress: 'V6T 1Z4 Vancouver, BC',
                vehicleLicensePlate: 'ABC123',
                count: 10,
            }, {
                parkingLotId: 5,
                parkingLotAddress: 'M5T 1Z4 Toronto, ON',
                vehicleLicensePlate: 'XYZ987',
                count: 7,
            }, {
                parkingLotId: 2,
                parkingLotAddress: 'M5T 1Z4 Toronto, ON',
                vehicleLicensePlate: 'ABC123',
                count: 20,
            }])
        }
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
                                                                <Link to='/vehicles'>{elem.vehicleLicensePlate}</Link>
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