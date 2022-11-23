import { Col, Container, Form, Row } from "react-bootstrap"
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../constants/constants";

export const AnalyticsPage = () => {
    interface LocationData {
        averageParkingPerDay: string; // past 30 days
        listOfUsersWithTickets: {  // past 30 days
            name: string;
            email: string;
            num_tickets: number;
        }[];
        listOfUsersWhoParked10Times: { // past 30 days
            name: string;
            email: string;
            parked: number;
        }[]
    }

    const [overviewData, setOverviewData] = useState<{ anylot: string; alllots: string, alllotsuser: {name:string, email: string}[], overavg: {name:string, count:string}[] } | null>(null);
    const [locations, setLocations] = useState<{ lotid: number; postalcode: string, city: string, province: string }[]>([]);
    const [selectedValue, setSelectedValue] = useState<number | null>(null);
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
        if (selectedValue !== null) {
            const fetchVehicle = async () => {
              try {
                  const response = await fetch(SERVER_URL + "/api/parkingLot/stats?lotId=" + selectedValue, {
                      method: "GET",
                      credentials: "include"
                  });
                  let json: {
                    averagePark: string,
                    tickets: {name: string, email: string, num_tickets: number}[],
                    parked: {name: string, email: string, parked: number}[]
                  } = (await response.json());
                  
                  setLocationData({
                    averageParkingPerDay: json.averagePark,
                    listOfUsersWithTickets: json.tickets.sort((a, b) => b.num_tickets - a.num_tickets),
                    listOfUsersWhoParked10Times: json.parked.sort((a, b) => b.parked - a.parked),
                  })
              } catch (e) {
                  console.error(e);
                  alert("Failed to fetch stats");
              }
          }
          fetchVehicle();
        }
    }, [selectedValue]);


    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const val = event.target.value;
        setSelectedValue(isNaN(parseInt(val, 10)) ? null : parseInt(val, 10));
    }

    return (
        <Container className="mx-auto">
            <Row className="justify-content-center">
                <Col xs md="12" lg="12" className="align-items-center">
                    <Row xs={1} lg={2}>
                        <Col>
                            <h3>Overview</h3>
                            <h5 className="text-muted">For last 60 days</h5>
                            <Row>
                                <Col>
                                    <h6>Number of people parked at any parking lot: {overviewData?.anylot}</h6>
                                    <h6>Number of people parked at all parking lots: {overviewData?.alllots}</h6>
                                    <ul>
                                      {overviewData?.alllotsuser.map(({ name, email }) => (
                                          <li key={name + email}>{`Name: ${name}, Email: ${email}`}</li>
                                      ))}
                                    </ul>
                                    <h6>Number of people with over average vehicles: {overviewData?.overavg?.length}</h6>
                                    <ul>
                                      {overviewData?.overavg?.map(({ name, count }) => (
                                          <li key={name + count}>{`Name: ${name}, Vehicles: ${count}`}</li>
                                      ))}
                                    </ul>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr/>
            <Row className="pb-4">
                <h3>Parking Lot Stats</h3>
                <h5 className="text-muted">For last 60 days</h5>
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
                    selectedValue !== null && (
                        <Row>
                            <Col>
                                <h6>Average number of vehicle parked per day: {locationData?.averageParkingPerDay}</h6>
                                <h6>Users with 3+ tickets: </h6>
                                <ul>
                                    {locationData?.listOfUsersWithTickets.map(({ name, email, num_tickets }) => (
                                        <li key={name + email + num_tickets}>{`Name: ${name}, Email: ${email}, Tickets: ${num_tickets}`}</li>
                                    ))}
                                </ul>
                                <h6>Users who parked 3+ times: </h6>
                                <ul>
                                    {locationData?.listOfUsersWhoParked10Times.map(({ name, email, parked }) => (
                                        <li key={name + email + parked}>{`Name: ${name}, Email: ${email}, Times Parked: ${parked}`}</li>
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