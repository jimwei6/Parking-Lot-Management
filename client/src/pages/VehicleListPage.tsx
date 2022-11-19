import { Button, Card, Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SERVER_URL } from "../constants/constants";

export interface Vehicle {
    licensePlate: string;
    model: string;
    height: number;
    color: string;
    isElectric: boolean;
    plugType?: string;
    permits: string[];
}

export const VehicleListPage = () => {

    const [vehicles, setVehicles] = useState<Array<Vehicle>>([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(SERVER_URL + "/api/vehicle", {
                    method: "GET",
                    credentials: "include"
                });
                const vehicles = await response.json();
                setVehicles(vehicles.result.map((vehicle: any) => ({
                    ...vehicle,
                    licensePlate: vehicle.licenseplate,
                    plugType: vehicle.plugtype,
                    isElectric: vehicle.iselectric,
                    color: '#' + vehicle.color,
                    permits: vehicle.permits.filter((permit: any) => permit !== null)
                })));
            } catch (e) {
                console.error(e);
                alert("Failed to fetch vehicles");
            }
        }
        fetchVehicles();
    }, []);

    const handleDelete = async (licensePlate: string) => {
        try {
            const response = await fetch(SERVER_URL + "/api/vehicle", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(vehicles.find(vehicle => vehicle.licensePlate === licensePlate)),
            });
            setVehicles(vehicles.filter(vehicle => vehicle.licensePlate !== licensePlate));
        } catch (e) {
            console.error(e);
            alert("Failed to delete vehicle");
        }
    }

    return (
        <Container className="my-auto">
            <Row className="justify-content-center">
                <Col xs md="12" lg="12" className="align-items-center">
                    {vehicles.length > 0 ? (
                        <Row xs={1} lg={2}>
                            {vehicles.map(({ licensePlate, model, height, color, isElectric, plugType, permits }) => (
                                <Col className="mb-3 align-items-center" key={licensePlate}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>
                                                <div className="d-flex justify-content-start">
                                                    {licensePlate}
                                                    <div className="ms-auto">
                                                        <Icon
                                                            variant="blue"
                                                            iconName="PlusCircleFill"
                                                            link={`/session/${licensePlate}/add`}>
                                                            new <strong>parking session</strong>
                                                        </Icon>
                                                        <Icon
                                                            variant="blue"
                                                            iconName="FileEarmarkText"
                                                            link={`/history/${licensePlate}`}>
                                                            view <strong>history</strong>
                                                        </Icon>
                                                        <Icon
                                                            variant="blue"
                                                            iconName="PencilSquare"
                                                            link={`/vehicle/${licensePlate}/update`}>
                                                            <strong>update</strong> vehicle details
                                                        </Icon>
                                                        <Icon
                                                            variant="red"
                                                            iconName="TrashFill"
                                                            onClick={() => {
                                                                handleDelete(licensePlate)
                                                            }}>
                                                            <strong>delete</strong> vehicle
                                                        </Icon>
                                                    </div>
                                                </div>
                                            </Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{model}</Card.Subtitle>
                                            <ul>
                                                <li>Height: {height}</li>
                                                <li>Color: {color}</li>
                                                <li>Electric: {isElectric ? 'Yes' : 'No'}</li>
                                                {isElectric && <li>Plug Type: {plugType}</li>}
                                                {permits.length > 0 && <li>Permits: {permits.join(', ')}</li>}
                                            </ul>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <h4 className="text-center pb-3">You have no vehicles</h4>
                    )}
                    <div className="pt-3 text-center">
                        <Link to="/vehicle/add">
                            <Button
                                variant="outline-primary"
                                style={{ width: "200px" }}
                            >
                                Add Vehicle
                            </Button>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
