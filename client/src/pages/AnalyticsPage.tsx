import { Col, Container, Form, Row } from "react-bootstrap"
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../constants/constants";

export const AnalyticsPage = () => {
    interface LocationData {
        averageParkingPerDay: number; // past 30 days
        listOfUsersWithTickets: {  // past 30 days
            name: string;
            email: string;
            tickets: number;
        }[];
        listOfUsersWhoParked10Times: { // past 30 days
            name: string;
            email: string;
            tickets: number;
        }[]
    }

    const [overviewData, setOverviewData] = useState<{ anylot: string; alllots: string } | null>(null);
    const [locations, setLocations] = useState<{ lotid: number; postalcode: string, city: string, province: string }[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [locationData, setLocationData] = useState<LocationData | null>(null);

    useEffect(() => {
        const fetchOverviewData = async () => {
            const promises = []
            promises.push(await fetch(SERVER_URL + '/api/overview', {
                method: 'GET',
                credentials: 'include'
            }));
            promises.push(await fetch(SERVER_URL + '/api/location', {
                method: 'GET',
                credentials: 'include'
            }));
            const responses = await Promise.all(promises);
            const json = await Promise.all(responses.map(response => response.json()));
            console.log(json[0], json[1].result);
            setOverviewData(json[0]);
            setLocations(json[1].result);
        }
        fetchOverviewData();
    }, []);

    useEffect(() => {
        if (selectedIndex !== null) {
            // TODO: Fetch data for the selected location from the API
            setLocationData({
                averageParkingPerDay: 10,
                listOfUsersWithTickets: [
                    { name: "John Doe", email: "john.d@cpsc.com", tickets: 4 },
                    { name: "Jane Doe", email: "jane.d@cpsc.com", tickets: 5 },
                    { name: "John Smith", email: "john.s@cpsc.com", tickets: 6 },
                    { name: "Jane Smith", email: "jane.s@cpsc.com", tickets: 7 },
                ].sort((a, b) => b.tickets - a.tickets),
                listOfUsersWhoParked10Times: [
                    { name: "John Doe", email: "john.d@cpsc.com", tickets: 16 },
                    { name: "Jane Doe", email: "jane.d@cpsc.com", tickets: 20 },
                    { name: "John Smith", email: "john.s@cpsc.com", tickets: 11 },
                    { name: "Jane Smith", email: "jane.s@cpsc.com", tickets: 10 },
                ].sort((a, b) => b.tickets - a.tickets),
            })
        }
    }, [selectedIndex]);


    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const index = event.target.selectedIndex;
        setSelectedIndex(index == 0 ? null : index - 1);
    }

    return (
        <Container className="mx-auto">
            <Row className="justify-content-center">
                <Col xs md="12" lg="12" className="align-items-center">
                    <Row xs={1} lg={2}>
                        <Col>
                            <h3>Overview</h3>
                            <h5 className="text-muted">For last 30 days</h5>
                            <Row>
                                <Col>
                                    <h6>Number of people parked at any parking lot: {overviewData?.anylot}</h6>
                                    <h6>Number of people parked at all parking lots: {overviewData?.alllots}</h6>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr/>
            <Row className="pb-4">
                <h3>Parking Lot Stats</h3>
                <h5 className="text-muted">For last 30 days</h5>
                <Row className="mb-3" xs={1} md={3}>
                    <Form.Group as={Col} controlId="location">
                        <Form.Select
                            placeholder="Select a parking lot"
                            onChange={handleChange}
                        >
                            <option>Select a parking lot</option>
                            {locations.map(({ postalcode, city, province }, index) => (
                                <option key={postalcode + city + province}
                                        value={index}>{`${postalcode} ${city}, ${province}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Row>
                {
                    selectedIndex !== null && (
                        <Row>
                            <Col>
                                <h6>Average number of people parked per day: {locationData?.averageParkingPerDay}</h6>
                                <h6>Users with the most tickets: </h6>
                                <ul>
                                    {locationData?.listOfUsersWithTickets.map(({ name, email, tickets }) => (
                                        <li key={name + email + tickets}>{`${name} (${email}): ${tickets}`}</li>
                                    ))}
                                </ul>
                                <h6>Users who parked 10+ times: </h6>
                                <ul>
                                    {locationData?.listOfUsersWhoParked10Times.map(({ name, email, tickets }) => (
                                        <li key={name + email + tickets}>{`${name} (${email}): ${tickets}`}</li>
                                    ))}
                                </ul>
                            </Col>
                        </Row>
                    )
                }
            </Row>
        </Container>
    )
}