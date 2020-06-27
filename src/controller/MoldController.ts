import { Request, Response } from 'express';
import moment from 'moment';
import { getRepository } from 'typeorm';
import { Ingredient } from '../entity/Ingredient';
import { IngredientMold } from '../entity/IngredientMold';
import { Mold } from '../entity/Mold';
import { Recovery } from '../entity/Recovery';
import { getMoldById } from '../helper/moldHelpers';
import { getRecoveryByIdMold } from '../helper/recoveryHelpers';
import { getUserById } from '../helper/userHelpers';
import { Identifier } from '../type/Identifier';
import { RecoveryState } from '../type/RecoveryState';

export default class MoldController {

    static async getAll(req : Request, res : Response) {

        let status = 200;
        let body = {};

        try {
            const molds = await getRepository(Mold)
                .createQueryBuilder()
                .select('*')
                .getRawMany();
            body = {
                molds,
                'message' : 'all molds returned'
            };
        } catch (error) {
            status = 500;
            body = { 'message' : error.message };
        }
        return res.status(status).json(body);
    }

    static async delete(req : Request, res : Response) {
        let id = req.params.id;
        let status = 200;
        let body = {};
        try {

            await getRepository(Mold).delete(id);
            body = {
                'message' : 'mold deleted'
            };

        } catch (error) {
            status = 500;
            body = { 'message' : error.message };
        }
        return res.status(status).json(body);
    }

    static async give(req : Request, res : Response) {
        const mold = await getMoldById(req.body.idMold);
        const recoveryEntity = new Recovery();
        const random = Math.random().toString(36).substring(2, 15);
        try {
            recoveryEntity.mold = mold;
            recoveryEntity.recoveryState = RecoveryState.NotTaken;
            recoveryEntity.recoveryNumber = random;
            await getRepository(Recovery).save(recoveryEntity);
            await getRepository(Mold).update(req.body.idMold, { pickable : true });
            return res.status(200).json({
                message : 'Ajouté à la liste de recuperation'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }

    static async take(req : Request, res : Response) {
        const recovery = await getRecoveryByIdMold(req.body.idMold);
        try {
            await getRepository(Mold).update(req.body.idMold, { pickable : false });
            await getRepository(Recovery).delete(recovery.id);

            return res.status(200).json({
                message : 'Retiré de la liste de recuperation'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }

    static async insert(req : Request, res : Response) {
        const { name, quantity, pickUpAddress, idUser } = req.body;
        const moldEntity = new Mold();
        const userEntity = await getUserById(idUser);
        try {
            moldEntity.name = name;
            moldEntity.compositionDate = moment().locale('fr').format('DD-MM-YYYY HH:mm:ss');
            moldEntity.user = userEntity;
            moldEntity.quantity = quantity;
            moldEntity.pickUpAddress = pickUpAddress;
            const mold = await getRepository(Mold).save(moldEntity);

            const ingredientIds = JSON.parse(req.body.ingredientIds) as Identifier[];
            for (const ingredientId of ingredientIds) {
                const ingredient = await getRepository(Ingredient).findOne(ingredientId);
                if (ingredient) {
                    const ingredientMoldEntity = new IngredientMold();
                    ingredientMoldEntity.ingredient = ingredient;
                    ingredientMoldEntity.mold = mold;
                    await getRepository(IngredientMold).save(ingredientMoldEntity);
                }
            }
            return res.status(200).json({
                message : 'creation réussi'
            });

        } catch (error) {
            return res.status(500).json({
                message : error.message
            });
        }
    }

}
