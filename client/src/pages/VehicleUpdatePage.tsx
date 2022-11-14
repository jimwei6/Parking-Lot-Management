import { Button, Col, Container, Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Vehicle } from "./VehicleListPage";
import { boolean, number, object, string } from "yup";
import { FormikHelpers } from "formik/dist/types";
import { Formik } from "formik";

export const VehicleUpdatePage = () => {
    interface FormFields {
        model: string;
        height: string;
        color: string;
        isElectric: boolean;
        plugType: string;
        permits: string;
    }

    const [models, setModels] = useState<Array<string>>([]);
    const [permits, setPermits] = useState<Array<string>>([]);
    const [plugTypes, setPlugTypes] = useState<Array<string>>([]);

    const { licensePlate } = useParams();
    const [vehicle, setVehicle] = useState<Vehicle>();

    const navigate = useNavigate();

    const schema = object().shape({
        model: string().required().oneOf(models, "model is a required field"),
        height: number().integer().positive().required(),
        color: string().required(),
        isElectric: boolean(),
        plugType: string().when('isElectric', {
            is: true,
            then: string().required().label("plug type"),
            otherwise: string().notRequired(),
        }).oneOf(plugTypes, "plug type is a required field"),
        permits: string().required().oneOf(permits, "permit is a required field"),
    });

    useEffect(() => {
        // TODO: make a request to the server to get the vehicle using the licensePlate parameter
        //       handle the case where the vehicle is not found
        setVehicle({
            licensePlate: 'ABC123',
            model: 'Tesla Model 3',
            height: 1800,
            color: '#FF0000',
            isElectric: true,
            plugType: 'Type 2',
            permits: ['accessibility', 'vip']
        })
        //    TODO: make a request to the server to get the list of models, permits, and plug types
        setModels(['Tesla Model 3', `Tesla Model S`, 'Tesla Model X', 'Tesla Model Y']);
        setPermits(['Permit type A', 'Permit type B', 'Permit type C']);
        setPlugTypes(['Type 1', 'Type 2', 'Type 3']);
    }, []);

    const handleUpdate = (values: FormFields, actions: FormikHelpers<FormFields>) => {
        const { model, height, color, isElectric, plugType, permits } = values;
        console.log(model, height, color, isElectric, plugType, permits)
        const { setFieldError, setSubmitting } = actions;
        // TODO: make a request to the server to add a vehicle
        navigate('/vehicles');
    }

    return (
        <Container className="my-auto">
            <Row className="justify-content-center">
                <Col xs lg="8" className="align-items-center">
                    <Formik
                        validationSchema={schema}
                        onSubmit={handleUpdate}
                        initialValues={{
                            model: vehicle?.model || '',
                            height: vehicle?.height.toString() || '',
                            color: vehicle?.color || '',
                            isElectric: vehicle?.isElectric || false,
                            plugType: vehicle?.plugType || '',
                            permits: vehicle?.permits.join(', ') || '',
                        }}
                        enableReinitialize
                    >
                        {({
                              handleSubmit,
                              handleChange,
                              values,
                              touched,
                              errors,
                              isSubmitting
                          }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Row className="mb-3" xs={1} md={2}>
                                    <Form.Group as={Col} controlId="height">
                                        <Form.Label>Height (mm)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter height (mm)"
                                            value={values.height}
                                            onChange={handleChange}
                                            isValid={!errors.height}
                                            isInvalid={touched.height && !!errors.height}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.height}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="model">
                                        <Form.Label>Model</Form.Label>
                                        <Form.Select
                                            placeholder="Enter Model"
                                            value={values.model}
                                            onChange={handleChange}
                                            isValid={!errors.model}
                                            isInvalid={touched.model && !!errors.model}
                                        >
                                            <option>Select a model</option>
                                            {models.map((model) => (
                                                <option key={model} value={model}>{model}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.model}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3" xs={1} md={2}>
                                    <Form.Group as={Col} controlId="permits">
                                        <Form.Label>Permit</Form.Label>
                                        <Form.Select
                                            placeholder="Enter Permit"
                                            value={values.permits}
                                            onChange={handleChange}
                                            isValid={!errors.permits}
                                            isInvalid={touched.permits && !!errors.permits}
                                        >
                                            <option>Select a permit</option>
                                            {permits.map((permit) => (
                                                <option key={permit} value={permit}>{permit}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.permits}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3" controlId="color">
                                        <Form.Label>Color</Form.Label>
                                        <Form.Control
                                            type="color"
                                            placeholder="Enter Color"
                                            value={values.color}
                                            onChange={handleChange}
                                            isValid={!errors.color}
                                            isInvalid={touched.color && !!errors.color}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.color}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                {
                                    vehicle?.isElectric && (
                                        <Row className="mb-3" xs={1} md={2}>
                                            <Form.Group controlId="plugType">
                                                <Form.Label>Plug Type</Form.Label>
                                                <Form.Select
                                                    placeholder="Enter Plug Type"
                                                    value={values.plugType}
                                                    onChange={handleChange}
                                                    isValid={!errors.plugType}
                                                    isInvalid={touched.plugType && !!errors.plugType}
                                                >
                                                    <option>Select a plug type</option>
                                                    {plugTypes.map((type) => (
                                                        <option key={type} value={type}>{type}</option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.plugType}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                    )
                                }
                                <div className="pt-3 text-center">
                                    <Button
                                        variant="outline-primary"
                                        type="submit"
                                        style={{ width: "100px" }}
                                        disabled={isSubmitting}>
                                        Update
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    )
}
