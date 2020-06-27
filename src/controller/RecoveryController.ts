import { Request, Response } from 'express';
import moment from 'moment';
import { getRepository } from 'typeorm';
import { PartnerRecovery } from '../entity/PartnerRecovery';
import { Recovery } from '../entity/Recovery';
import { getMoldById } from '../helper/moldHelpers';
import { getPartnerRecoveryById } from '../helper/partnerRecoveryHelpers';
import { getRecoveryById } from '../helper/recoveryHelpers';
import { getUserById } from '../helper/userHelpers';
import { sendMail } from '../helper/utils';
import { RecoveryState } from '../type/RecoveryState';

export default class RecoveryController {

    static async getAll(req : Request, res : Response) {

        let status = 200;
        let body = {};

        try {
            const recoveries = await getRepository(Recovery)
                .createQueryBuilder()
                .select('*')
                .getRawMany();
            body = {
                recoveries,
                'message' : 'all Recoveries returned'
            };
        } catch (error) {
            status = 500;
            body = { 'message' : error.message };
        }
        return res.status(status).json(body);
    }

    static async pick(req : Request, res : Response) {
        const partnerRecovery = new PartnerRecovery();
        const userEntity = await getUserById(req.body.idUser);

        try {
            const recovery = await getRecoveryById(req.body.idRecovery);
            const mold = await getMoldById(recovery.idMold);
            const customer = await getUserById(mold.idUser);
            await getRepository(Recovery).update(req.body.idRecovery, { recoveryState : RecoveryState.Taken });
            partnerRecovery.user = userEntity;
            partnerRecovery.pickDate = moment().locale('fr').format('DD-MM-YYYY HH:mm:ss');
            partnerRecovery.recovery = recovery;
            await getRepository(PartnerRecovery).save(partnerRecovery);
            await sendMail(customer.email, 'Suivi de votre colis', `<p>Votre colis a été pris en charge par la société ${ userEntity.username }</p>`);
            return res.status(200).json({
                message : 'Colis recuperer'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }

    static async leave(req : Request, res : Response) {
        try {
            const partnerRecovery = await getPartnerRecoveryById(req.body.idPartnerRecovery);
            const userEntity = await getUserById(partnerRecovery.idUser);
            const recovery = await getRecoveryById(partnerRecovery.idRecovery);
            const mold = await getMoldById(recovery.idMold);
            const customer = await getUserById(mold.idUser);
            await getRepository(PartnerRecovery).delete(partnerRecovery.id);
            await getRepository(Recovery).update(recovery.id, { recoveryState : RecoveryState.NotTaken });
            await sendMail(
                customer.email, 'Suivi de votre colis',
                `<p>la société ${ userEntity.username } a finalement décider de ne pas recuperer votre colis nous en somme désoler. Votre colis sera bientot pris en charge par une autre société</p>`
            );

            return res.status(200).json({
                message : 'Colis abandonné'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }

    static async invalidate(req : Request, res : Response) {
        try {
            const partnerRecovery = await getPartnerRecoveryById(req.body.idPartnerRecovery);
            const userEntity = await getUserById(partnerRecovery.idUser);
            const recovery = await getRecoveryById(partnerRecovery.idRecovery);
            const mold = await getMoldById(recovery.idMold);
            const customer = await getUserById(mold.idUser);
            await getRepository(Recovery).update(recovery.id, { recoveryState : RecoveryState.Invalid });
            await sendMail(
                customer.email, 'Suivi de votre colis',
                `<p>la société ${ userEntity.username } a recu votre commande. Le colis recu n'est pas conforme</p>`
            );

            return res.status(200).json({
                message : 'Colis invalid'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }

    static async validate(req : Request, res : Response) {
        try {
            const partnerRecovery = await getPartnerRecoveryById(req.body.idPartnerRecovery);
            const userEntity = await getUserById(partnerRecovery.idUser);
            const recovery = await getRecoveryById(partnerRecovery.idRecovery);
            const mold = await getMoldById(recovery.idMold);
            const customer = await getUserById(mold.idUser);
            await getRepository(Recovery).update(recovery.id, { recoveryState : RecoveryState.Delivered });
            await sendMail(
                customer.email, 'Suivi de votre colis',
                `<p>la société ${ userEntity.username } a recu votre colis. Il est conforme, nous vous en remerciez.</p>`
            );

            return res.status(200).json({
                message : 'Colis recu'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }

}
