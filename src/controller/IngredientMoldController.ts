import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { IngredientMold } from '../entity/IngredientMold';

export default class IngredientMoldController {

    static async getAll(req : Request, res : Response) {

        let status = 200;
        let body = {};

        try {
            const ingredientMolds = await getRepository(IngredientMold)
                .createQueryBuilder()
                .select('*')
                .getRawMany();
            body = {
                ingredientMolds,
                'message' : 'all Ingredients returned'
            };
        } catch (error) {
            status = 500;
            body = { 'message' : error.message };
        }
        return res.status(status).json(body);
    }

}
