import { Request, Response } from 'express';
import { getAllRewards, insertReward } from '../helper/rewardHelper';
import { Reward } from '../entity/Reward';
import { getRepository } from 'typeorm';
import { getUserById } from '../helper/userHelpers';

class RewardController {

    static async getAllRewards(req : Request, res : Response) {
        try {
            let rewards = await getAllRewards();
            return res.status(200).json({
                rewards
            });
        } catch (e) {
            return res.status(404).json({
                'message' : e.message
            });
        }
    }

    static async insertReward(req : Request, res : Response) {
        const rewardEntity : Reward = new Reward();
        try {
            rewardEntity.promoCode = req.body.promoCode;
            rewardEntity.reduction = req.body.reduction;
            rewardEntity.expirationDate = req.body.expirationDate;
            const existingUser = await getUserById(req.body.idUser);
            if (existingUser) {
                // id user
                rewardEntity.user = existingUser;
                const reward = await insertReward(rewardEntity);
                return res.status(200).json({
                    reward
                });
            } else {
                return res.status(200).json({
                    'message' : 'Le user n\'existe pas ou pas défini'
                });
            }

        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }

    static async updateReward(req : Request, res : Response) {
        const id = req.params.id;
        const reward = req.body;
        try {
            await getRepository(Reward).update(id, reward);
            return res.status(200).json({
                message : 'Modification réussie'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }

    static async deleteReward(req : Request, res : Response) {
        const id = req.params.id;
        try {
            const deleted = await getRepository(Reward).delete(id);
            return res.status(200).json({
                deleted,
                message : 'Suppression réussie'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }
}

export default RewardController;