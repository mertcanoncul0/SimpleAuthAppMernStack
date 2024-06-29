import express, { Router } from 'express';
import { againVerificationEmail, forgotPassword, forgotPasswordVerification, login, register, signWithToken, verificationEmail } from '../controllers/authentication';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.post('/auth/token', signWithToken);
    router.post('/auth/verification', verificationEmail);
    router.post('/auth/re-verification', againVerificationEmail);
    router.post('/auth/forgot-password', forgotPassword);
    router.post('/auth/forgot-password-verification', forgotPasswordVerification)
}