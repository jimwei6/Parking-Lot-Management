import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Formik } from "formik";
import { boolean, number, object, string } from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Vehicle } from "./VehicleListPage";
import { FormikHelpers } from "formik/dist/types";
import { SERVER_URL } from "../constants/constants";

export const NewSessionPage = () => {

    const { licensePlate } = useParams();
    const [spots, setSpots] = useState<Spot[]>([]);
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const [locations, setLocations] = useState<{ lotid: number; postalcode: string, city: string, province: string }[]>([]);
    const [vehicle, setVehicle] = useState<Vehicle>();
    const [isCreating, setIsCreating] = useState(false);
    const [hasFiltered, setHasFiltered] = useState(false);
    const navigate = useNavigate();

    interface Spot {
        spotId: number;
        availableTime: number;
        spotType: string;
        isElectric: boolean;
        plugType?: string;
        isAccessible: boolean;
        accessibilityType?: string;
        lotId: number;
        postalCode: string;
        city: string;
        province: string;
    }

    interface FormFields {
        duration: number;
        location: string; // city, province
        spotType: '*' | 'reserved' | 'company' | 'vip';
        accessibilityType: '*' | 'accessibility' | 'infant';
        needsCharging?: boolean;
    }

    const [spotTypes, setSpotTypes] = useState(['reserved', 'company', 'vip']);
    const [accessibilityTypes, setAccessibilityTypes] = useState(['accessibility', 'infant']);

    const schema = object().shape({
        duration: number().positive().required(),
        location: string(),
        spotType: string(),
        accessibilityType: string(),
        needsCharging: boolean(),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const promises = []
                promises.push(await fetch(SERVER_URL + "/api/vehicle?licensePlate=" + licensePlate, {
                    method: "GET",
                    credentials: "include"
                }))
                promises.push(await fetch(SERVER_URL + '/api/location', {
                    method: 'GET',
                    credentials: 'include'
                }));
                const responses = await Promise.all(promises);
                if (!responses[0].ok) {
                    alert("Vehicle not found");
                } else if (!responses[1].ok) {
                    alert("Locations not found");
                }
                const json = await Promise.all(responses.map(response => response.json()));
                const vehicle = json[0].result.find((vehicle: any) => vehicle.licenseplate === licensePlate);
                const permits = vehicle.permits.filter((permit: any) => permit !== null)
                setLocations(json[1].result);
                setVehicle({
                    ...vehicle,
                    licensePlate: vehicle.licenseplate,
                    plugType: vehicle.plugtype,
                    isElectric: vehicle.iselectric,
                    color: '#' + vehicle.color,
                    permits: permits
                });
                setSpotTypes(spotTypes.filter(spotType => permits.includes(spotType)));
                setAccessibilityTypes(accessibilityTypes.filter(accessibilityType => permits.includes(accessibilityType)));
            } catch (e) {
                console.error(e);
                alert("Failed to fetch vehicles");
            }
        }
        fetchData();
    }, []);

    const createSession = async () => {
        setIsCreating(true);
        try {
            // TODO: NOT WORKING, server error
            const response = await fetch(SERVER_URL + "/api/session", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    lotId: selectedSpot?.lotId,
                    licensePlate: vehicle?.licensePlate,
                    spotId: selectedSpot?.spotId,
                })
            });
            if (!response.ok) {
                alert("Failed to create session");
            } else {
                navigate(`/history/${licensePlate}`);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to create session");
        }
        setIsCreating(false);
    }

    const findSpots = async (values: FormFields, actions: FormikHelpers<FormFields>) => {
        const { accessibilityType, spotType, duration, location, needsCharging } = values;
        const { setSubmitting } = actions;
        try {
            const url = new URL(SERVER_URL + "/api/parkingSpots");
            const params: {
                [key: string]: string
            } = {
                licensePlate: licensePlate || '',
                needsCharging: needsCharging?.toString() || "false",
                duration: duration.toString(),
            }
            if (location !== '*') {
                params['location'] = location;
            }
            if (accessibilityType !== '*') {
                params['accessType'] = accessibilityType;
            }
            if (spotType !== '*') {
                params['spotType'] = spotType;
            }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            // TODO: filter by plugType in SQL query (vehicle?.plugType)
            //       THIS IS IMPORTANT BECAUSE OTHERWISE INVALID SPOTS WILL BE RETURNED, I THINK
            //       filter by height in SQL query (vehicle?.height || 0)
            //       Change no spotType to normal
            //       Change no accessType to normal parking spots
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                alert("Failed to find spots");
            } else {
                const json = await response.json();
                let spots: Spot[] = json.result.map((spot: any) => ({
                    availableTime: spot.availabletime,
                    city: spot.city,
                    lotId: spot.lotid,
                    plugType: spot.plugtype,
                    postalCode: spot.postalcode,
                    province: spot.province,
                    spotId: spot.spotid,
                    spotType: spot.spottype,
                    accessibilityType: spot.accessibilitytype,
                    isElectric: spot.plugtype !== null,
                    isAccessible: spot.accessibilitytype !== null
                }));
                setSpots(spots);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to find spots");
        }
        setHasFiltered(true);
        setSubmitting(false);
    }

    return (
        <Container className="mx-auto">
            <Row className="justify-content-center">
                <Col xs md="12" lg="12" className="align-items-center">
                    <Row xs={1} lg={2} className="pb-4">
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
                            </Row>
                        </Col>
                    </Row>
                    <Row className="pb-4">
                        <h4>Filters</h4>
                        <Formik
                            validationSchema={schema}
                            onSubmit={findSpots}
                            initialValues={{
                                duration: 0,
                                location: '*',
                                spotType: '*',
                                accessibilityType: '*',
                                needsCharging: false,
                            }}
                        >
                            {({
                                  handleSubmit,
                                  handleChange,
                                  values,
                                  touched,
                                  errors,
                                  dirty,
                                  isSubmitting
                              }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Row className="mb-3" xs={1} md={3}>
                                        <Form.Group as={Col} controlId="location">
                                            <Form.Label>Location</Form.Label>
                                            <Form.Select
                                                placeholder="Select a location"
                                                value={values.location}
                                                onChange={handleChange}
                                            >
                                                <option value="*">All locations</option>
                                                {locations.map(({ postalcode, city, province, lotid }) => (
                                                    <option key={postalcode + city + province + lotid}
                                                            value={`${lotid}`}>
                                                        {postalcode + ', ' + city + ', ' + province}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.location}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="spotType">
                                            <Form.Label>Spot Type</Form.Label>
                                            <Form.Select
                                                placeholder="Select a spot type"
                                                value={values.spotType}
                                                onChange={handleChange}
                                            >
                                                <option value="*">normal</option>
                                                {spotTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.spotType}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="accessibilityType">
                                            <Form.Label>Accessibility Type</Form.Label>
                                            <Form.Select
                                                placeholder="Select a an accessibility type"
                                                value={values.accessibilityType}
                                                onChange={handleChange}
                                            >
                                                <option value="*">none</option>
                                                {accessibilityTypes.map(type => {
                                                    return <option key={type} value={type}>{type}</option>
                                                })}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.location}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3 align-items-center" xs={1} md={3}>
                                        <Form.Group as={Col} controlId="duration">
                                            <Form.Label>Duration (mins)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter required duration (mins)"
                                                value={values.duration}
                                                onChange={handleChange}
                                                isInvalid={touched.duration && !!errors.duration}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.duration}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        {vehicle?.isElectric && (
                                            <Form.Group as={Col} controlId="needsCharging">
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Needs Charging"
                                                    defaultChecked={values.needsCharging}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        )}
                                    </Row>
                                    <div className="pt-3 text-center">
                                        <Button
                                            variant="outline-primary"
                                            type="submit"
                                            style={{ width: "100px" }}
                                            disabled={isSubmitting}>
                                            Filter
                                        </Button>
                                        <Button
                                            className="ms-4"
                                            variant="outline-primary"
                                            style={{ width: "100px" }}
                                            disabled={!selectedSpot || isCreating}
                                            onClick={createSession}>
                                            Create
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Row>
                    {spots.length > 0 ? (
                        <Row xs={1} lg={2}>
                            <Table bordered>
                                <thead>
                                <tr>
                                    <th>Spot Number</th>
                                    <th>Postal Code</th>
                                    <th>City</th>
                                    <th>Province</th>
                                    <th>Available Time</th>
                                    <th>Spot Type</th>
                                    <th>Plug Type</th>
                                    <th>Accessibility Type</th>
                                </tr>
                                </thead>
                                <tbody>
                                {spots.map((spot) => (
                                    <tr
                                        onClick={() => setSelectedSpot(spot)}
                                        className={`${selectedSpot?.spotId === spot.spotId &&
                                        selectedSpot?.lotId === spot.lotId ? 'text-bg-primary' : ''}`}
                                        key={`l${spot.lotId}s${spot.spotId}`}
                                    >
                                        <td>{spot.spotId}</td>
                                        <td>{spot.postalCode}</td>
                                        <td>{spot.city}</td>
                                        <td>{spot.province}</td>
                                        <td>{spot.availableTime}</td>
                                        <td>{spot.spotType}</td>
                                        <td>{spot.isElectric ? spot.plugType : '-'}</td>
                                        <td>{spot.isAccessible ? spot.accessibilityType : '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Row>
                    ) : (
                        hasFiltered && <h5 className="text-center pb-3">No results</h5>
                    )}
                </Col>
            </Row>
        </Container>
    )
}