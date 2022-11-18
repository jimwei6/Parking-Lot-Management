import { createContext, useContext, useEffect, useState } from "react";
import { SERVER_URL } from "../constants/constants";

interface StateContextProps {
    permits: string[],
    models: string[],
    plugTypes: string[],
    spotTypes: string[],
    accessTypes: string[]
}

const StateContext = createContext({} as StateContextProps);

export const StateProvider = ({ children }: any) => {
    const [state, setState] = useState<StateContextProps>({
        permits: [],
        models: [],
        plugTypes: [],
        spotTypes: [],
        accessTypes: []
    });

    useEffect(() => {
        const fetchTypes = async () => {
            const res = await fetch(`${SERVER_URL}/api/types`, { method: 'GET', credentials: 'include' });
            setState(await res.json());
        }
        fetchTypes();
    }, []);

    return (
        <StateContext.Provider value={{
            permits: state.permits,
            models: state.models,
            plugTypes: state.plugTypes,
            spotTypes: state.spotTypes,
            accessTypes: state.accessTypes
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useAppState = () => useContext(StateContext);
