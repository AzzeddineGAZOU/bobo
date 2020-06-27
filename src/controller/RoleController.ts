import { Request, Response } from 'express';
import { getAllRoles } from '../helper/roleHelpers';

class RoleController {

    static async getAllRoles(req: Request, res: Response) {
        try {
            let roles = await getAllRoles();
            return res.status(200).json({
                roles
            });
        } catch (e) {
            return res.status(404).json({
                'message' : e.message
            });
        }
    }

}

export default RoleController;