import express from "express";
import { createUser, getUserByEmail, getUserBySessionToken } from "../db/users";
import { authentication, generateOtp, random, sendMail } from "../helpers";

let generateCurrentOtp = 0;
let generateForgotPasswordId = 0;

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                message:
                    !email ? 'email eksik' : ''
                    || !password ? 'password eksik' : ''
            });
        }

        const existingUser = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!existingUser) {
            return res.status(404).json({
                ok: false,
                message: 'Bu E-postaya ait kullanıcı bulunamadı'
            });
        }

        const expectedHash = authentication(existingUser.authentication.salt, password);

        if (existingUser.authentication.password !== expectedHash) {
            return res.status(409).json({
                ok: false,
                message: 'Şifre Yanlış'
            });
        }

        if (!existingUser.isActive) {
            return res.status(409).json({
                ok: true,
                existingUser
            });
        }

        const salt = random();
        existingUser.authentication.sessionToken = authentication(salt, existingUser._id.toString());

        await existingUser.save();

        res.cookie(process.env.cookieKey, existingUser.authentication.sessionToken, { domain: 'localhost', path: '/' });

        return res.status(200).json({ existingUser, ok: true }).end();
    }

    catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: 'Sistemsel bir hata oluştu.'
        });
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({
                ok: false,
                message:
                !username ? 'username eksik' : ''
                || !email ? 'email eksik' : ''
                || !password ? 'password eksik' : '',
            });
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser && !existingUser.isActive) {
            return res.status(409).json({
                ok: true,
                existingUser
            });
        }

        if (existingUser) {
            return res.status(409).json({
                ok: false,
                message: 'Bu Kullanıcı zaten kayıtlı'
            });
        }

        const salt = random();

        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        generateCurrentOtp = generateOtp();
        setTimeout(() => {
            generateCurrentOtp = 0;
        }, 5 * 60 * 1000);

        sendMail({
            from: process.env.mail,
            to: email,
            subject: `${username} merhaba biz expense tracker olarak bu maili size gönderiyoruz`,
            html: `<h1>şifreniz budur: ${generateCurrentOtp}</h1>`
        });

        return res.status(200).json({
            ok: true,
            user
        }).end();
    }

    catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: error.message
        });
    }
}

export const signWithToken = async (req: express.Request, res: express.Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                ok: false,
                message: 'token yok'
            });
        }

        const user = await getUserBySessionToken(token);

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'user bulunamadı'
            });
        }

        return res.status(200).json({ok: true, user})
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: error.message
        });
    }
}

export const verificationEmail = async (req: express.Request, res: express.Response) => {
    const { otp, email } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(404).json({
            ok: false,
            message: 'kullanıcı bulunamadı'
        });
    }

    if (otp !== generateCurrentOtp) {
        return res.status(409).json({
            ok: false,
            message: 'otp kodu doğru değil'
        });
    }

    user.isActive = true;

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());
    await user.save();

    res.cookie(process.env.cookieKey, user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).json({
        ok: true,
        user
    }).end();
}

export const againVerificationEmail = async (req: express.Request, res: express.Response) => {
    const { email } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(404).json({
            ok: false,
            message: 'kullanıcı bulunamadı'
        });
    }

    if (!user.isActive) {
        generateCurrentOtp = generateOtp();

        setTimeout(() => {
            generateCurrentOtp = 0;
        }, 5 * 60 * 1000);

        sendMail({
            from: process.env.mail,
            to: email,
            subject: `${user.username} merhaba biz expense tracker olarak bu maili size yeniden gönderiyoruz`,
            html: `<h1>yeni şifreniz budur: ${generateCurrentOtp}</h1>`
        });
    }

    return res.status(200).json({
        ok: true,
        user
    }).end();
}

export const forgotPassword = async (req: express.Request, res: express.Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                ok: false,
                message: !email ? 'username eksik' : ''
            });
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'kullanıcı bulunamadı'
            });
        }
        generateForgotPasswordId = generateOtp();
        sendMail({
            from: process.env.mail,
            to: email,
            subject: `${user.username} merhaba biz expense tracker olarak bu maili size yeniden gönderiyoruz`,
            html: `<h1>şifre yenileme linkiniz: <a href='http://localhost:5173/new/forgot/${generateForgotPasswordId}'>link</a></h1>`
        });

        return res.status(200).json({
            ok: true,
            message: 'şifre yenileme linkiniz epostanıza gönderildi'
        }).end();

    }   catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: error.message
        });
    }
}

export const forgotPasswordVerification = async (req: express.Request, res: express.Response) => {
    const { id, email, password } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(404).json({
            ok: false,
            message: 'kullanıcı bulunamadı'
        });
    }

    if (id !== generateForgotPasswordId) {
        return res.status(409).json({
            ok: false,
            message: 'id kodu doğru değil'
        });
    }

    const salt = random();

    user.authentication.password = authentication(salt, password);
    user.authentication.salt = salt;
    await user.save();

    return res.status(200).json({
        ok: true,
        message: 'şifreniz başarılı bir şekilde değiştirildi'
    }).end();
}