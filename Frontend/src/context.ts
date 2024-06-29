import { createContext, useContext } from "react";
import { AuthContextProps } from "./types";

export const defaultAuthContextValues: AuthContextProps = {
    sessionToken: '',
    setSessionToken: () => { }
};

const AuthContext = createContext(defaultAuthContextValues);

export {
    AuthContext,
    useContext
}