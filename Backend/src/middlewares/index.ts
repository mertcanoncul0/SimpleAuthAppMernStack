import express from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;
        
        if (!currentUserId) {
            return res.status(403).json({
                ok: false,
                return: 'yetkin yok'
            });
        }

        if (currentUserId.toString() !== id) {
            return res.status(403).json({
                ok: false,
                return: 'yetkin yok'
            });
        }
        
        return next()
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            return: 'sistemsel bir hata'
        });
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['hello'];

        if (!sessionToken) {
            return res.status(403).json({
                ok: false,
                return: 'yetkin yok'
            });
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.status(403).json({
                ok: false,
                return: 'yetkin yok'
            });
        }

        merge(req, { identity: existingUser });

        return next()
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            return: 'sistemsel bir hata'
        });
    }
}