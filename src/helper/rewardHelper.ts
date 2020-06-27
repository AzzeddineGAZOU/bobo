import { getRepository } from 'typeorm';
import { Reward } from '../entity/Reward';

export const getAllRewards = async () => await getRepository(Reward)
    .createQueryBuilder()
    .select('*')
    .getRawMany();

export const insertReward = async (reward : Reward) => await getRepository(Reward).save(reward);
