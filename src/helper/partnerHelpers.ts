import { getRepository } from 'typeorm';
import { PartnershipRequest } from '../entity/PartnershipRequest';
import { RequestState } from '../type/RequestState';

export const insertPartnershipRequest = async (partner : PartnershipRequest) => await getRepository(PartnershipRequest).save(partner);

export const getAllPartnershipRequest = async () => await getRepository(PartnershipRequest)
    .createQueryBuilder()
    .select('*')
    .getRawMany();

export const getPartnershipRequestById = async (id : number) => await getRepository(PartnershipRequest)
    .createQueryBuilder()
    .select('*')
    .where('id = :id', { id : id })
    .getRawOne();

export const deletePartnershipRequest = async () => {
    const partnerRequests = await getAllPartnershipRequest();
    if (partnerRequests.length) {
        await getRepository(PartnershipRequest).remove(partnerRequests);
    }
    return true;
};

export const verifyEmail = async (email : string) => await getRepository(PartnershipRequest)
    .createQueryBuilder()
    .select('COUNT(*) as count')
    .where('email = :email', { email : email })
    .getRawMany();

export const verifyUsername = async (username : string) => await getRepository(PartnershipRequest)
    .createQueryBuilder()
    .select('COUNT(*) as count')
    .where('username = :username', { username : username })
    .getRawMany();

export const requestDenied = async (id : number) => await getRepository(PartnershipRequest).update(id, {requestState: RequestState.Denied});

export const requestGranted = async (id : number) => await getRepository(PartnershipRequest).update(id, {requestState: RequestState.Granted});
