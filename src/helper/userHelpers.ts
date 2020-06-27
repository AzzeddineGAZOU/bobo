import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { deleteAllAddress } from './addressHelpers';

export const getAllUsers = async () => await getRepository(User)
    .createQueryBuilder()
    .select('*')
    .getRawMany();

export const getUserById = async (id : number) => await getRepository(User)
    .createQueryBuilder()
    .select('*')
    .where('id = :id', { id : id })
    .getRawOne();

export const deleteAllUser = async () => {
    await deleteAllAddress();
    const users = await getAllUsers();
    if (users.length) {
        await getRepository(User).remove(users);
    }
    return true;
};

export const insertUser = async (user : User) => getRepository(User).save(user);

export const verifyEmail = async (email : string) => await getRepository(User)
    .createQueryBuilder()
    .select('COUNT(*) as count')
    .where('email = :email', { email : email })
    .getRawMany();

export const verifyUsername = async (username : string) => await getRepository(User)
    .createQueryBuilder()
    .select('COUNT(*) as count')
    .where('username = :username', { username : username })
    .getRawMany();

export const getUserByCredential = async (login : string) => await getRepository(User).createQueryBuilder()
    .select('*')
    .where('username = :username OR email=:email', { username : login, email : login })
    .getRawOne();

export const verifyCredential = async (login : string, password : string) => await getRepository(User)
    .createQueryBuilder('user')
    .where('username = :login', { login : login })
    .andWhere('password = :password', { login : password })
    .getRawMany();

export const resetPassword = async (email : string, password : string) => await getRepository(User).update({ email : email }, { password : password });