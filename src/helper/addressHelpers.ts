import { getManager, getRepository } from 'typeorm';
import { Address } from '../entity/Address';

export const getAllAddress = async () => await getRepository(Address)
    .createQueryBuilder()
    .select('*')
    .getRawMany();

export const getAddressByUser = async (idUser: number)  => await getRepository(Address)
    .createQueryBuilder()
    .select('*')
    .where('idUser = :idUser', { idUser : idUser })
    .getRawOne();

export const insertAddress = async (address : Address) => await getRepository(Address).save(address);

export const deleteAllAddress = async () => {
    const addresses = await getAllAddress();
    if (addresses.length) {
        await getRepository(Address).remove(addresses);
    }
};

export const updateAddress = (id: number, data : Address) => getRepository(Address)
    .createQueryBuilder()
    .update(Address)
    .set(data)
    .where('idUser = :id', {id : id})
    .execute();