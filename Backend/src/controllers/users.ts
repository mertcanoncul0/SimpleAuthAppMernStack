import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request,res: express.Response) => {
    try {
        const users = await getUsers();
        
        return res.status(200).json(users).end();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: 'sistemsel bir hata oluştu'
        });
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        if (!deletedUser) {
            return res.status(404).json({
                ok: false,
                message: 'kullanıcı bulunamadı'
            });
        }

        return res.status(200).json(deletedUser).end();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: 'sistemsel bir hata oluştu'
        });
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({
                ok: false,
                message: 'eksik'
            });
        }

        const user = await getUserById(id);
        user.username = username;
        await user.save();

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: 'sistemsel bir hata oluştu'
        });
    }
}