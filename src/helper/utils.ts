import * as nodemailer from 'nodemailer';

export const sendMail = async (email : string, subject : string, html : string) => {
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : 'seb.hitema@gmail.com',
            pass : 'sebsebseb'
        }
    });

    const mailOptions = {
        from : 'seb.hitema@gmail.com',
        to : email,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};