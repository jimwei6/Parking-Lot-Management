import { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../constants/constants";

interface AuthContextProps {
    home: string;
    isAuthenticated: boolean;
    username: string;
    password: string;
    login: (username: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
    const [{ username, password }, setCookie, removeCookie] = useCookies(['username', 'password']);
    const [isAuthenticated, setIsAuthenticated] = useState(!!username);
    const navigate = useNavigate();
    const home = '/vehicles';

    const login = async (username: string, password: string) => {
        const url = new URL(`${SERVER_URL}/auth`);
        url.search = new URLSearchParams({ username, password }).toString();
        try {
            const response = await fetch(url, { method: 'GET' })
            if (response.ok) {
                setCookie('username', username, { path: '/' });
                setCookie('password', password, { path: '/' });
                setIsAuthenticated(true);
                navigate(home);
            }
        } catch (e) {
            console.error(e);
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
            home,
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
