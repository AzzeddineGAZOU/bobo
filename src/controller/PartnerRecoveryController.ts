import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { PartnerRecovery } from '../entity/PartnerRecovery';

export default class PartnerPartnerRecoveryController {

    static async getAll(req : Request, res : Response) {

        let status = 200;
        let body = {};

        try {
            const partnerRecoveries = await getRepository(PartnerRecovery)
                .createQueryBuilder()
                .select('*')
                .getRawMany();
            body = {
                partnerRecoveries,
                'message' : 'all partnerRecoveries returned'
            };
        } catch (error) {
            status = 500;
            body = { 'message' : error.message };
        }
        return res.status(status).json(body);
    }

}
