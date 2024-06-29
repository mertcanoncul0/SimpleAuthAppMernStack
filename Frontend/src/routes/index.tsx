import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/home";
import { New } from "../pages/new";
import { Login } from "../pages/login";
import { Register } from "../pages/register";
import { signHome, signNew, signOtp } from "../service/authentication";
import { Otp } from "../pages/otp";
import { ForgotPassword } from "../pages/forgot";
import { ForgotVerification } from "../pages/forgotVerification";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        loader: signHome
    },
    {
        path: 'new',
        element: <New />,
        loader: signNew
    },
    {
        path: 'new/login',
        element: <Login />,
        loader: signNew
    },
    {
        path: 'new/register',
        element: <Register />,
        loader: signNew
    },
    {
        path: 'new/otp',
        element: <Otp />,
        loader: signOtp
    },
    {
        path: 'new/forgot',
        element: <ForgotPassword />,
        loader: signNew
    },
    {
        path: 'new/forgot/:id',
        element: <ForgotVerification />,
        loader: signNew
    }
]);