import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Ingredient } from '../entity/Ingredient';

export default class IngredientController {

    static async getAll(req : Request, res : Response) {

        let status = 200;
        let body = {};

        try {
            const ingredients = await getRepository(Ingredient)
                .createQueryBuilder()
                .select('*')
                .getRawMany();
            body = {
                ingredients,
                'message' : 'all Ingredients returned'
            };
        } catch (error) {
            status = 500;
            body = { 'message' : error.message };
        }
        return res.status(status).json(body);
    }

}
