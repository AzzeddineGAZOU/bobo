import { getRepository } from 'typeorm';
import { Role } from '../entity/Role';

export const getAllRoles = async () => await getRepository(Role)
    .createQueryBuilder()
    .select('*')
    .getRawMany();

export const getRoleCustomer = async () => await getRepository(Role).find({
    where : {
        name : 'ROLE_USER',
    }
});

export const getRolePartner = async () => await getRepository(Role).find({
    where : {
        name : 'ROLE_PARTNER',
    }
});