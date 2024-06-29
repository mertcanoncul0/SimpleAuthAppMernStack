import { ReactNode } from "react";
import { Link } from "react-router-dom";

export const Button = ({ type, to, fn = () => {}, children }: { type: string, to: string, fn: any, children: ReactNode }) => {
    let buttonClassName = '';
    switch (type) {
        case 'login':
            buttonClassName = 'login'
            break;
        case 'google':
            buttonClassName = 'google'
            break;
        case 'register':
            buttonClassName = 'register'
            break;
    }

    return <Link to={to} onClick={fn} className={`btn btn-${buttonClassName}`}>{children}</Link>
}