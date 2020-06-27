import { Request, Response } from 'express';
import { sendMail } from '../helper/utils';

class MailController {

    static async sendMail(req : Request, res : Response) {
        const email = req.body.email;
        const subject = req.body.subject;
        const html = req.body.html;

        try {
            await sendMail(email, subject, html);
            return res.status(200).json({
                message : 'Mail envoyé'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }

}
export default MailController;