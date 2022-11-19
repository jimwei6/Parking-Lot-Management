import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import React from "react";
import { object, string } from "yup";
import { Formik } from 'formik';
import { FormikHelpers } from "formik/dist/types";
import { useAuth } from "../contexts/AuthContext";


export const LoginPage = () => {

    interface FormFields {
        username: string;
        password: string;
    }

    const schema = object().shape({
        username: string().required().max(100),
        password: string().required().max(100)
    });

    const { login } = useAuth();

    const handleLogin = async (values: FormFields, actions: FormikHelpers<FormFields>) => {
        const { username, password } = values;
        const { setFieldError, setSubmitting } = actions;
        await login(username, password);
        // login will handle navigation, we only reach this point if login fails
        setFieldError('username', 'Invalid username or password');
        setFieldError('password', 'Invalid username or password');
        setSubmitting(false);
    }

    return (
        <Container className="my-auto">
            <Row className="justify-content-center">
                <Col xs md="8" lg="6" className="align-items-center">
                    <Card>
                        <Card.Body>
                            <Card.Title>Login</Card.Title>
                            <Formik
                                validationSchema={schema}
                                onSubmit={handleLogin}
                                initialValues={{
                                    username: '',
                                    password: '',
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
                                        <Form.Group className="mb-3" controlId="username">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter username"
                                                value={values.username}
                                                onChange={handleChange}
                                                isValid={dirty && !errors.username}
                                                isInvalid={touched.username && !!errors.username}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.username}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter password"
                                                value={values.password}
                                                onChange={handleChange}
                                                isValid={dirty && !errors.password}
                                                isInvalid={touched.password && !!errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <div className="text-center">
                                            <Button
                                                variant="outline-primary"
                                                type="submit"
                                                style={{ width: "100px" }}
                                                disabled={isSubmitting}>
                                                Login
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
