import { getRepository } from 'typeorm';
import { Recovery } from '../entity/Recovery';

export const getRecoveryById = async (id : number) => await getRepository(Recovery)
    .createQueryBuilder()
    .select('*')
    .where('id = :id', { id : id })
    .getRawOne();

export const getRecoveryByIdMold = async (idMold : number) => await getRepository(Recovery)
    .createQueryBuilder()
    .select('*')
    .where('idMold = :idMold', { idMold : idMold })
    .getRawOne();