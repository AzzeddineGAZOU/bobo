import { getRepository } from 'typeorm';
import { Mold } from '../entity/Mold';

export const getMoldById = async (id : number) => await getRepository(Mold)
    .createQueryBuilder()
    .select('*')
    .where('id = :id', { id : id })
    .getRawOne();