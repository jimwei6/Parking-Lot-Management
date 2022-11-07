import React, { createContext, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
    isAuthenticated: boolean;
    username: string;
    password: string;
    login: (username: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
    const [{ username, password }, setCookie, removeCookie] = useCookies(['username', 'password']);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // TODO: make a request to the server to check if username and password in the cookie are correct
        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
        }
    }, [username, password]);

    const login = (username: string, password: string) => {
        // TODO: make a request to the server to check if the username and password are correct
        if (username === 'admin' && password === 'admin') {
            setCookie('username', username, { path: '/' });
            setCookie('password', password, { path: '/' });
            setIsAuthenticated(true);
            navigate('/profile');
        }
    };

    const logout = () => {
        removeCookie('username');
        removeCookie('password');
        setIsAuthenticated(false);
        navigate('/login');
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            username,
            password,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
