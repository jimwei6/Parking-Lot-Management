import { Button, Card, Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

export interface Vehicle {
    licensePlate: string;
    model: string;
    height: number;
    color: string;
    isElectric: boolean;
    plugType?: string;
    permit: string;
}

export const VehicleListPage = () => {

    const [vehicles, setVehicles] = useState<Array<Vehicle>>([]);

    useEffect(() => {
        //    TODO: make a request to the server to get the list of vehicles
        setVehicles([{
            licensePlate: 'ABC123',
            model: 'Tesla Model 3',
            height: 1800,
            color: '#FF0000',
            isElectric: true,
            plugType: 'Type 2',
            permit: 'Accessibility',
        }, {
            licensePlate: 'XYZ987',
            model: 'Toyota Prius',
            height: 1900,
            color: '#00FF00',
            isElectric: false,
            permit: 'Accessibility',
        }, {
            licensePlate: 'LMN456',
            model: 'Aston Martin DB5',
            height: 1600,
            color: '#F3F3F3',
            isElectric: false,
            permit: 'Accessibility',
        }])
    }, []);

    const handleDelete = (licensePlate: string) => {
        //    TODO: make a request to the server to delete the vehicle
        setVehicles(vehicles.filter(vehicle => vehicle.licensePlate !== licensePlate));
    }

    return (
        <Container className="my-auto">
            <Row className="justify-content-center">
                <Col xs md="12" lg="12" className="align-items-center">
                    {vehicles.length > 0 ? (
                        <Row xs={1} lg={2}>
                            {vehicles.map(({ licensePlate, model, height, color, isElectric, plugType, permit }) => (
                                <Col className="mb-3 align-items-center" key={licensePlate}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>
                                                <div className="d-flex justify-content-start">
                                                    {licensePlate}
                                                    <div className="ms-auto">
                                                        {/* TODO: Add route to session for vehicle */}
                                                        <Icon
                                                            variant="blue"
                                                            iconName="FileEarmarkText"
                                                            link={`/vehicle/${licensePlate}/history`}>
                                                            Click to view <strong>history</strong>
                                                        </Icon>
                                                        <Icon
                                                            variant="blue"
                                                            iconName="PencilSquare"
                                                            link={`/vehicle/${licensePlate}/update`}>
                                                            Click to <strong>update</strong> vehicle
                                                        </Icon>
                                                        <Icon
                                                            variant="red"
                                                            iconName="TrashFill"
                                                            onClick={() => {
                                                                handleDelete(licensePlate)
                                                            }}>
                                                            Click to <strong>delete</strong> vehicle
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
                                                <li>Permit: {permit}</li>
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
