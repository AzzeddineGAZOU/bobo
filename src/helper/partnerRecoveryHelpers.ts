import { getRepository } from 'typeorm';
import { PartnerRecovery } from '../entity/PartnerRecovery';

export const getPartnerRecoveryById = async (id : number) => await getRepository(PartnerRecovery)
    .createQueryBuilder()
    .select('*')
    .where('id = :id', { id : id })
    .getRawOne();