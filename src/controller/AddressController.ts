import { Request, Response } from 'express';
import { updateAddress, getAddressByUser, getAllAddress } from '../helper/addressHelpers';
class AddressController {

    static async getAllAddress(req: Request, res: Response) {
        try {
            let addresses = await getAllAddress();
            return res.status(200).json({
                addresses
            });
        } catch (e) {
            return res.status(404).json({
                'message' : e.message
            });
        }
    }
    

    static async getAddressByUsers(req: Request, res: Response) {
        try {
            let id = req.params.id;
            let addressUser = await getAddressByUser(parseInt(id));
            return res.status(200).json({
                addressUser
            });
        } catch (e) {
            return res.status(404).json({
                'message' : e.message
            });
        }
    }

    static async updateAddressByIdUser(req: Request, res: Response) {
        let id = req.params.id;
        const addressData = req.body;
        try {
            const address = await updateAddress(parseInt(id), addressData);
            return res.status(200).json({
                address
            });
        } catch (e) {
            res.status(500).json({
                'message': e.message
            });
            return;
        }
    }

}

export default AddressController;