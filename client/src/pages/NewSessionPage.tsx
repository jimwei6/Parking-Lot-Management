import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Formik } from "formik";
import { boolean, number, object, string } from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Vehicle } from "./VehicleListPage";
import { FormikHelpers } from "formik/dist/types";

export const NewSessionPage = () => {

    const { licensePlate } = useParams();
    const [spots, setSpots] = useState<Spot[]>([]);
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const [locations, setLocations] = useState<{
        postalCode: string;
        city: string;
        province: string;
        lotId: number;
    }[]>([]);
    const [vehicle, setVehicle] = useState<Vehicle>();
    const [isCreating, setIsCreating] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
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
        lotCapacity: number; // total number of spots in the lot
        lotAvailability: number;  // total number of unoccupied spots in the lot
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
        //  TODO: make a request to the server to get vehicle info using licensePlate
        const v: Vehicle = {
            licensePlate: licensePlate || '',
            model: 'Tesla Model 3',
            height: 1800,
            color: '#FF0000',
            isElectric: true,
            plugType: 'Type 2',
            permits: ['accessibility', 'company', 'vip'],
        };
        setVehicle(v);
        setSpotTypes(spotTypes.filter(spotType => v.permits.includes(spotType)));
        setAccessibilityTypes(accessibilityTypes.filter(accessibilityType => v.permits.includes(accessibilityType)));
        //  TODO: make a request to the server to get the set of locations of all the lots
        setLocations([{
            postalCode: 'M5V 1A1',
            city: 'Toronto',
            province: 'Ontario',
            lotId: 0
        }, {
            postalCode: 'V6T 1Z4',
            city: 'Vancouver',
            province: 'BC',
            lotId: 1
        }, {
            postalCode: 'O6T 1Z4',
            city: 'Ottawa',
            province: 'Ontario',
            lotId: 2
        }, {
            postalCode: 'V1V 1V1',
            city: 'Victoria',
            province: 'BC',
            lotId: 3
        }])
    }, []);

    const createSession = () => {
        //  TODO: make a request to the server to create a new session using selectedSpot and vehicle
        setIsCreating(true);
        setTimeout(() => {
            setIsCreating(false);
            navigate(`/history/${licensePlate}`);
        }, 1000);
    }

    const findSpots = (values: FormFields, actions: FormikHelpers<FormFields>) => {
        //  TODO: make a request to the server to get the set of spots that match the criteria
        //        accessibilityType, spotType be arrays of strings or a single string
        //          a single string means that the user has selected a specific type
        //          an array of strings means that the user has selected has opted for any type in the array
        //        city and province can be * to indicate all locations (both will be *)
        //        city and province can be a specific location (both will be a specific location)
        //        needsCharging can be true (charging on) or false (charging off)
        //        duration is the number of minutes the user wants to park for
        //        the query will also accept vehicle height to filter the spots by height
        //        the query will also accept vehicle plugType to filter the spots if needsCharging is true

        const height = vehicle?.height || 0;
        const plugType = vehicle?.plugType || '';
        const vehiclePermits = vehicle?.permits || '';
        const { accessibilityType, spotType, duration, location, needsCharging } = values;
        const accessibilityArray = accessibilityType === '*' ? accessibilityTypes : [accessibilityType];
        const spotArray = spotType === '*' ? spotTypes : [spotType];
        const city = location === '*' ? '*' : location.split(',')[0];
        const province = location === '*' ? '*' : location.split(',')[1];
        const { setSubmitting } = actions;
        console.log(accessibilityArray, spotArray, city, province, duration, needsCharging);
        setTimeout(() => {
            setHasFiltered(true);
            setSpots([{
                spotId: 1,
                availableTime: 7200,
                spotType: 'normal',
                isElectric: false,
                isAccessible: false,
                lotId: 1,
                postalCode: 'V6T 1Z4',
                city: 'Vancouver',
                province: 'BC',
                lotCapacity: 10,
                lotAvailability: 5
            }, {
                spotId: 2,
                availableTime: 10800,
                spotType: 'vip',
                isElectric: true,
                plugType: 'J1772',
                isAccessible: false,
                lotId: 1,
                postalCode: 'V6T 1Z4',
                city: 'Vancouver',
                province: 'BC',
                lotCapacity: 10,
                lotAvailability: 5
            }, {
                spotId: 2,
                availableTime: 10800,
                spotType: 'vip',
                isElectric: true,
                plugType: 'J1772',
                isAccessible: false,
                lotId: 5,
                postalCode: 'O6T 1Z4',
                city: 'Ottawa',
                province: 'ON',
                lotCapacity: 300,
                lotAvailability: 200
            }, {
                spotId: 1,
                availableTime: 3600,
                spotType: 'reserved',
                isElectric: false,
                isAccessible: true,
                accessibilityType: 'infant',
                lotId: 2,
                postalCode: 'V1V 1V1',
                city: 'Victoria',
                province: 'BC',
                lotCapacity: 45,
                lotAvailability: 25
            }])
            setSubmitting(false);
        }, 1000);
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
                                                {locations.map(({ postalCode, city, province, lotId }) => (
                                                    <option key={postalCode + city + province + lotId }
                                                            value={`${lotId}`}>
                                                        {postalCode + ', ' + city + ', ' + province}
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
                                                <option value="*">Any spot type</option>
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
                                                <option value="*">No preference</option>
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
                                    <th>Lot Capacity</th>
                                    <th>Lot Availability</th>
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
                                        <td>{spot.lotCapacity}</td>
                                        <td>{spot.lotAvailability}</td>
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