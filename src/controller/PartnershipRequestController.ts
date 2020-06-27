import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import moment from 'moment';
import { PartnershipRequest } from '../entity/PartnershipRequest';
import { insertPartnershipRequest, verifyEmail, verifyUsername, requestDenied, requestGranted, getPartnershipRequestById, getAllPartnershipRequest } from '../helper/partnerHelpers';
import { RequestState } from '../type/RequestState';
import UserController from '../controller/UserController';

class PartnershipRequestController {

    static async getAllPartnershipRequests(req : Request, res : Response) {
        try {
            let partnershipRequests = await getAllPartnershipRequest();
            return res.status(200).json({
                partnershipRequests
            });
        } catch (e) {
            return res.status(404).json({
                'message' : e.message
            });
        }
    }

    static async getPartnershipRequestById(req : Request, res : Response) {
        try {
            let id = req.params.id;
            let partnershipRequest = await getPartnershipRequestById(parseInt(id));
            return res.status(200).json({
                partnershipRequest
            });
        } catch (e) {
            return res.status(404).json({
                'message' : e.message
            });
        }
    }

    static async insertPartnershipRequest(req : Request, res : Response) {
        const partnerRequestEntity : PartnershipRequest = new PartnershipRequest();

        try {
            partnerRequestEntity.firstname = req.body.firstname;
            partnerRequestEntity.lastname = req.body.lastname;
            // Nom de la société au lieu d'un username
            partnerRequestEntity.username = req.body.username;
            // Vérification des différents champs
            // Le username du partnership correspond au nom de la société
            const getVerifiedUsername = await verifyUsername(req.body.username);
            const getVerifiedEmail = await verifyEmail(req.body.email);
            const regexEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/);
            if (getVerifiedUsername[0]['count'] > 0) {
                res.status(400).json({
                    message: 'Société existant. Utilisez un autre nom société svp'
                });
                return;
            }
            if (!regexEmail.test(req.body.email)) {
                console.log('bad email');
                res.status(400).json({
                    message: 'Le format de l\'email est incorrect'
                });
                return;
            }
            if (getVerifiedEmail[0]['count'] > 0) {
                res.status(400).json({
                    message: 'Email existant. Utilisez un autre email svp'
                });
                return;
            }
            const verifyPostcode = new RegExp(/^[0-9]{5}$/);
            if (!verifyPostcode.test(req.body.postcode)) {
                console.log('bad postcode');
                res.status(400).json({
                    message: 'Mauvais code postal. Format: NNNNN'
                });
                return;
            }
            partnerRequestEntity.email = req.body.email;
            // Chiffrer le password
            const passwordHash = bcrypt.hashSync(req.body.password, 10);
            partnerRequestEntity.password = passwordHash;
            partnerRequestEntity.address = req.body.address;
            partnerRequestEntity.postcode = req.body.postcode;
            partnerRequestEntity.city = req.body.city;
            partnerRequestEntity.motivation = req.body.motivation;
            partnerRequestEntity.requestState = RequestState.Sent;
            partnerRequestEntity.submittedDate = moment().locale('fr').format('DD-MM-YYYY HH:mm:ss');
            // Insérer en base table user les données partnerEntity
            const partnershipRequest = await insertPartnershipRequest(partnerRequestEntity);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'seb.hitema@gmail.com',
                  pass: 'sebsebseb'
                }
              });

            const mailOptions = {
                from: 'seb.hitema@gmail.com',
                to: 'seb.hitema@gmail.com',
                subject: 'Un partenaire vous envoie une requête',
                html: '<p>La société ' + partnerRequestEntity.username + ' vous envoie une demande.</p>' +
                        '<p>Vous pouvez aller voir dans la liste des partenaires pour avoir des détails en plus en vous connectant ou en cliquant <a href="/partnershipRequest">ici</a></p>'
            };

            transporter.sendMail(mailOptions, async function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.status(200).json({
                        partnershipRequest,
                        message: 'Envoi réussi'
                    });
                    return;
                }
            });

        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }

    static async partnerRequestDenied(req : Request, res : Response) {
        const id = parseInt(req.params.id);
        try {
            const getPartner = await getPartnershipRequestById(id);
            if (getPartner['requestState'] === 'D') {
                res.status(400).json({
                    message: 'Vous avez déjà refusé cette requête'
                });
                return;
            }
            const denied = await requestDenied(id);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'seb.hitema@gmail.com',
                  pass: 'sebsebseb'
                }
              });

            const mailOptions = {
                from: 'seb.hitema@gmail.com',
                to: getPartner['email'],
                subject: 'Requête refusée',
                html: '<p>Nous sommes désolés de vous annoncer que votre profil n\'a pas été retenu</p>'
            };

            transporter.sendMail(mailOptions, async function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.status(200).json({
                        denied,
                        message: 'Envoi réussi'
                    });
                    return;
                }
            });
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }

    static async partnerRequestGranted(req : Request, res : Response) {
        const id = parseInt(req.params.id);
        try {
            const getPartner = await getPartnershipRequestById(id);
            if (getPartner['requestState'] === 'G') {
                res.status(400).json({
                    message: 'Vous avez déjà validé cette requête'
                });
                return;
            }
            await requestGranted(id);
            const result = await getPartnershipRequestById(id);
            const callInsertPartner = await UserController.insertPartnerGranted(id);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'seb.hitema@gmail.com',
                  pass: 'sebsebseb'
                }
              });

            const mailOptions = {
                from: 'seb.hitema@gmail.com',
                to: getPartner['email'],
                subject: 'Requête acceptée',
                html: '<p>Nous sommes heureu de vous annoncer que votre profil a été retenu</p>' +
                    '<p>Vous pouvez vous connecter dès maintenant sur la plateforme</p>'
            };

            transporter.sendMail(mailOptions, async function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.status(200).json({
                        result,
                        callInsertPartner,
                        message: 'Envoi réussi'
                    });
                    return;
                }
            });
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
}

export default PartnershipRequestController;