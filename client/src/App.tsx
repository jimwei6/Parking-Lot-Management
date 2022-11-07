import React from 'react';
import './App.css';
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { LoginPage, ProfilePage, VehicleCreationPage, VehicleDetailsPage } from "./pages";
import { useAuth } from "./contexts/AuthContext";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

const RedirectRoute = ({ redirectCondition, redirectTo }: { redirectCondition: boolean, redirectTo: string }) => {
    return redirectCondition ? <Navigate to={redirectTo} replace/> : <Outlet/>;
}

const App = () => {
    const { home, username, isAuthenticated } = useAuth();
    const { logout } = useAuth();

    return (
        <div className="d-flex flex-column justify-content-start vh-100">
            <Navbar expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to={home}>PLM</Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse className="justify-content-end">
                        {isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to="vehicle/details">Vehicle</Nav.Link>
                                <NavDropdown title={username} id="user-dropdown" drop="down" className="px-lg-5">
                                    <NavDropdown.Item as={Link} to="profile">Profile</NavDropdown.Item>
                                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path="" element={<ProfilePage/>}/>
                <Route element={<RedirectRoute redirectCondition={isAuthenticated} redirectTo={home}/>}>
                    <Route path="login" element={<LoginPage/>}/>
                </Route>
                <Route element={<RedirectRoute redirectCondition={!isAuthenticated} redirectTo="/login"/>}>
                    <Route path="profile" element={<ProfilePage/>}/>
                    <Route path="vehicle/details" element={<VehicleDetailsPage/>}/>
                    <Route path="vehicle/create" element={<VehicleCreationPage/>}/>
                </Route>
                <Route path="*" element={<Navigate to={home} replace/>}/>
            </Routes>
        </div>
    );
}

export default App;
