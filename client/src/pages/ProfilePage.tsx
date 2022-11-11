import React, { useEffect, useState } from "react";
import { date, object, string } from "yup";
import { FormikHelpers } from "formik/dist/types";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Formik } from "formik";
import { Icon } from "../components/Icon";
import { SERVER_URL } from "../constants/constants";

export const ProfilePage = () => {
    interface Profile {
        email: string;
        password: string;
        address: string;
        name: string;
        phonenumber: string;
        pronouns: string;
        gender: string;
        dob: string;
    }

    const [profile, setProfile] = useState<Profile>();

    useEffect(() => {
        const fetchProfile = async () => {
            const url = `${SERVER_URL}/api/profile`;
            try {
                const response = await fetch(url, { method: 'GET', credentials: 'include' })
                if (response.ok) {
                    const profile = await response.json();
                    setProfile({
                        ...profile,
                        dob: new Date(profile.dob).toISOString().split('T')[0],
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchProfile();
    }, []);

    const pronouns = ['He/Him/His', 'She/Her/Hers', 'They/Them/Theirs', 'Other'];
    const genders = ['Male', 'Female', 'Non-Binary', 'Other'];

    const [showPassword, setShowPassword] = useState(false);

    const schema = object().shape({
        email: string().email().required(),
        password: string().required(),
        address: string().required(),
        name: string().required(),
        phonenumber: string().required().matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 012-345-6789'),
        pronouns: string().required().oneOf(pronouns),
        gender: string().required().oneOf(genders),
        dob: date().max(new Date(), `date of birth field must be at earlier than ${new Date().toISOString().split('T')[0]}`)
            .min(new Date(1900, 1, 1), `date of birth field must be later than 1900-01-01`)
            .required().label('date of birth'),
    });

    const handleUpdate = (values: Profile, actions: FormikHelpers<Profile>) => {
        const { email, password, address, name, phonenumber, pronouns, gender, dob } = values;
        console.log(email, password, address, name, phonenumber, pronouns, gender, dob);
        const { setFieldError, setSubmitting } = actions;
        // TODO: make a request to the server to update the profile
        setSubmitting(false);
    }

    return (
        <Container className="my-auto">
            <Row className="justify-content-center">
                <Col xs lg="8" className="align-items-center">
                    <Formik
                        validationSchema={schema}
                        onSubmit={handleUpdate}
                        initialValues={{
                            email: profile?.email || '',
                            password: profile?.password || '',
                            address: profile?.address || '',
                            name: profile?.name || '',
                            phonenumber: profile?.phonenumber || '',
                            pronouns: profile?.pronouns || '',
                            gender: profile?.gender || '',
                            dob: profile?.dob || ''
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
                                    <Form.Group as={Col} controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            value={values.email}
                                            onChange={handleChange}
                                            isValid={!errors.email}
                                            isInvalid={touched.email && !!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter password"
                                                value={values.password}
                                                onChange={handleChange}
                                                isValid={!errors.password}
                                                isInvalid={touched.password && !!errors.password}
                                                style={{
                                                    borderTopRightRadius: '0.375rem',
                                                    borderBottomRightRadius: '0.375rem'
                                                }}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                            <Icon
                                                iconName={showPassword ? 'EyeSlashFill' : 'EyeFill'}
                                                variant="blue"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3" xs={1} md={2}>
                                    <Form.Group as={Col} controlId="name">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter name"
                                            value={values.name}
                                            onChange={handleChange}
                                            isValid={!errors.name}
                                            isInvalid={touched.name && !!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="phonenumber">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            placeholder="Enter phone number"
                                            value={values.phonenumber}
                                            onChange={handleChange}
                                            isValid={!errors.phonenumber}
                                            isInvalid={touched.phonenumber && !!errors.phonenumber}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.phonenumber}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Form.Group as={Col} className="mb-3" controlId="address">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="address"
                                        placeholder="Enter address"
                                        value={values.address}
                                        onChange={handleChange}
                                        isValid={!errors.address}
                                        isInvalid={touched.address && !!errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Row className="mb-3" xs={1} md={3}>
                                    <Form.Group as={Col} controlId="pronouns">
                                        <Form.Label>Pronouns</Form.Label>
                                        <Form.Select
                                            placeholder="Select Pronouns"
                                            value={values.pronouns}
                                            onChange={handleChange}
                                            isValid={!errors.pronouns}
                                            isInvalid={touched.pronouns && !!errors.pronouns}
                                        >
                                            <option>Select pronouns</option>
                                            {pronouns.map((pronoun) => (
                                                <option key={pronoun} value={pronoun}>{pronoun}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.pronouns}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="gender">
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Select
                                            placeholder="Enter Gender"
                                            value={values.gender}
                                            onChange={handleChange}
                                            isValid={!errors.gender}
                                            isInvalid={touched.gender && !!errors.gender}
                                        >
                                            <option>Select a gender</option>
                                            {genders.map((gender) => (
                                                <option key={gender} value={gender}>{gender}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.gender}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="dob">
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Select Date of Birth"
                                            value={values.dob}
                                            onChange={handleChange}
                                            isValid={!errors.dob}
                                            isInvalid={touched.dob && !!errors.dob}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.dob}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
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
