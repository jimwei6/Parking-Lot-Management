import React from 'react';
import './App.css';
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import {
    AnalyticsPage,
    LoginPage,
    NewSessionPage,
    ParkingHistoryPage,
    ProfilePage,
    VehicleAddPage,
    VehicleListPage,
    VehicleUpdatePage
} from "./pages";
import { useAuth } from "./contexts/AuthContext";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

const RedirectRoute = ({ redirectCondition, redirectTo }: { redirectCondition: boolean, redirectTo: string }) => {
    return redirectCondition ? <Navigate to={redirectTo}/> : <Outlet/>;
}

const App = () => {
    const { home, username, isAuthenticated } = useAuth();
    const { logout } = useAuth();

    return (
        <div className="pt-2 d-flex flex-column justify-content-start vh-100">
            <Navbar expand="lg" className="pb-4">
                <Container>
                    <Navbar.Brand as={Link} to={home}>PLM</Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse className="justify-content-end">
                        {isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to="/analytics" className="ps-lg-5">Analytics</Nav.Link>
                                <Nav.Link as={Link} to="/history" className="ps-lg-5">History</Nav.Link>
                                <Nav.Link as={Link} to="/vehicles" className="ps-lg-5">Vehicles</Nav.Link>
                                <NavDropdown title={username} id="user-dropdown" drop="down" className="px-lg-5">
                                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Navigate to={home}/>}/>
                <Route element={<RedirectRoute redirectCondition={isAuthenticated} redirectTo={home}/>}>
                    <Route path="/login" element={<LoginPage/>}/>
                </Route>
                <Route element={<RedirectRoute redirectCondition={!isAuthenticated} redirectTo="/login"/>}>
                    <Route path="/analytics" element={<AnalyticsPage/>}/>
                    <Route path="/session/:licensePlate/add" element={<NewSessionPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/vehicles" element={<VehicleListPage/>}/>
                    <Route path="/vehicle/:licensePlate/update" element={<VehicleUpdatePage/>}/>
                    <Route path="/vehicle/add" element={<VehicleAddPage/>}/>
                    <Route path="/history" element={<ParkingHistoryPage/>}/>
                    <Route path="/history/:licensePlate" element={<ParkingHistoryPage/>}/>
                </Route>
                <Route path="*" element={<Navigate to={home}/>}/>
            </Routes>
            <div className="py-3"></div>
        </div>
    );
}

export default App;
