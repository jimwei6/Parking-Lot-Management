import { Button, Col, Container, Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { array, boolean, number, object, string } from "yup";
import { FormikHelpers } from "formik/dist/types";
import { useNavigate } from "react-router-dom";

export const VehicleAddPage = () => {
    interface FormFields {
        license: string;
        model: string;
        height: string;
        color: string;
        isElectric: boolean;
        plugType: string;
        permits: string[];
    }

    const [models, setModels] = useState<Array<string>>([]);
    const [permits, setPermits] = useState<Array<string>>([]);
    const [plugTypes, setPlugTypes] = useState<Array<string>>([]);

    const navigate = useNavigate();

    const schema = object().shape({
        license: string().required(),
        model: string().required().oneOf(models, "model is a required field"),
        height: number().integer().positive().required(),
        color: string().required(),
        isElectric: boolean(),
        plugType: string().when('isElectric', {
            is: true,
            then: string().required().label("plug type"),
            otherwise: string().notRequired(),
        }).oneOf(plugTypes, "plug type is a required field"),
        permits: array().of(string()),
    });

    useEffect(() => {
        //    TODO: make a request to the server to get the list of models, permits, and plug types
        setModels(['Tesla Model 3', `Tesla Model S`, 'Tesla Model X', 'Tesla Model Y']);
        setPermits(['vip', 'company', 'reserved', 'infant', 'accessibility']);
        setPlugTypes(['Type 1', 'Type 2', 'Type 3']);
    }, []);

    const handleSubmit = (values: FormFields, actions: FormikHelpers<FormFields>) => {
        const { license, model, height, color, isElectric, plugType, permits } = values;
        console.log(license, model, height, color, isElectric, plugType, permits)
        const { setFieldError, setSubmitting } = actions;
        // TODO: make a request to the server to create a vehicle and add permits
        navigate('/vehicles');
    }

    return (
        <Container className="my-auto">
            <Row className="justify-content-center">
                <Col xs lg="8" className="align-items-center">
                    <Formik
                        validationSchema={schema}
                        onSubmit={handleSubmit}
                        initialValues={{
                            license: '',
                            model: '',
                            height: '',
                            color: '#000000',
                            isElectric: false,
                            plugType: '',
                            permits: [],
                        } as FormFields}
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
                                <Row className="mb-3" xs={1} md={2}>
                                    <Form.Group as={Col} controlId="license">
                                        <Form.Label>License</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter license"
                                            value={values.license}
                                            onChange={handleChange}
                                            isValid={dirty && !errors.license}
                                            isInvalid={touched.license && !!errors.license}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.license}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="height">
                                        <Form.Label>Height (mm)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter height (mm)"
                                            value={values.height}
                                            onChange={handleChange}
                                            isValid={dirty && !errors.height}
                                            isInvalid={touched.height && !!errors.height}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.height}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3" xs={1} md={2}>
                                    <Form.Group as={Col} controlId="model">
                                        <Form.Label>Model</Form.Label>
                                        <Form.Select
                                            placeholder="Select Model"
                                            value={values.model}
                                            onChange={handleChange}
                                            isValid={dirty && !errors.model}
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
                                    <Form.Group as={Col} controlId="permit">
                                        <Form.Label>Permits</Form.Label>
                                        <br/>
                                        {permits.map((permit) => (
                                            <Form.Check
                                                key={permit}
                                                inline
                                                label={permit}
                                                type="checkbox"
                                                name="permits"
                                                value={permit}
                                                defaultChecked={values.permits.includes(permit)}
                                                onChange={handleChange}
                                            />
                                        ))}
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3 align-items-center" xs={2}>
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
                                    <Form.Group as={Col} className="mb-3" controlId="isElectric">
                                        <Form.Check
                                            type="checkbox"
                                            label="Is your vehicle electric?"
                                            value="electric"
                                            name="isElectric"
                                            defaultChecked={values.isElectric}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Row>
                                {
                                    values.isElectric && (
                                        <Row className="mb-3" xs={1} md={2}>
                                            <Form.Group controlId="plugType">
                                                <Form.Label>Plug Type</Form.Label>
                                                <Form.Select
                                                    placeholder="Select Plug Type"
                                                    value={values.plugType}
                                                    onChange={handleChange}
                                                    isValid={dirty && !errors.plugType}
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
                                        Add
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
