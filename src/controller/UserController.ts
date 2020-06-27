import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as generator from 'generate-password';
import { Request, Response } from 'express';
import { Address } from '../entity/Address';
import { Role } from '../entity/Role';
import { User } from '../entity/User';
import { insertAddress, updateAddress } from '../helper/addressHelpers';
import { getRoleCustomer, getRolePartner } from '../helper/roleHelpers';
import { insertUser, verifyEmail, verifyUsername, getUserByCredential, resetPassword, getAllUsers, getUserById } from '../helper/userHelpers';
import { getPartnershipRequestById } from '../helper/partnerHelpers';
import { getRepository } from 'typeorm';

class UserController {

    static async getAllUsers(req : Request, res : Response) {
        try {
            let users = await getAllUsers();
            return res.status(200).json({
                users
            });
        } catch (e) {
            return res.status(404).json({
                'message' : e.message
            });
        }
    }

    static async getUserById(req : Request, res : Response) {
        try {
            let id = req.params.id;
            let user = await getUserById(parseInt(id));
            return res.status(200).json({
                user
            });
        } catch (e) {
            return res.status(404).json({
                'message' : e.message
            });
        }
    }

    static async insertCustomerAndAddress(req : Request, res : Response) {
        const userEntity : User = new User();
        const roleEntity : Role = new Role();
        const addressEntity : Address = new Address();

        try {
            // Récupère le role User (3)
            const customerRole = await getRoleCustomer();
            // Convertie en JSON et le parser
            const customerRoleJson = JSON.stringify(customerRole);
            const customerRoleResult = JSON.parse(customerRoleJson);
            // Mettre les données dans une nouvelle entité Role
            roleEntity.id = customerRoleResult[0]['id'];
            roleEntity.name = customerRoleResult[0]['name'];
            // Remplir entité User
            userEntity.firstname = req.body.firstname;
            userEntity.lastname = req.body.lastname;
            // Vérification des différents champs
            const getVerifiedUsername = await verifyUsername(req.body.username);
            const getVerifiedEmail = await verifyEmail(req.body.email);
            const regexEmail = new RegExp(/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,}$/);
            if (getVerifiedUsername[0]['count'] > 0) {
                res.status(400).json({
                    message : 'Pseudo existant. Utilisez un autre pseudo svp'
                });
                return;
            }
            if (!regexEmail.test(req.body.email)) {
                console.log('bad email');
                res.status(400).json({
                    message : 'Le format de l\'email est incorrect'
                });
                return;
            }
            if (getVerifiedEmail[0]['count'] > 0) {
                res.status(400).json({
                    message : 'Email existant. Utilisez un autre email svp'
                });
                return;
            }
            // Vérifier si le code postal a 5 chiffres
            const regexPostcode = new RegExp(/^[0-9]{5}$/);
            if (!regexPostcode.test(req.body.postcode)) {
                res.status(400).json({
                    message : 'Mauvais code postal. Format: NNNNN'
                });
                return;
            }
            userEntity.username = req.body.username;
            userEntity.email = req.body.email;
            // Chiffrer le password
            const passwordHash = bcrypt.hashSync(req.body.password, 10);
            userEntity.password = passwordHash;
            userEntity.role = roleEntity;
            // Remplir entité Address
            addressEntity.address = req.body.address;
            addressEntity.postcode = req.body.postcode;
            addressEntity.city = req.body.city;
            // Insérer en base table user les données userEntity
            const user = await insertUser(userEntity);
            // Avant d'insérer en base table address, prendre userEntity pour récupérer id
            // qui correspond à idUser dans la table address
            addressEntity.user = userEntity;
            const address = await insertAddress(addressEntity);
            return res.status(200).json({
                user,
                address,
            });
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }

    static async insertPartnerGranted(id : number) {
        const userEntity : User = new User();
        const roleEntity : Role = new Role();
        const addressEntity : Address = new Address();

        try {
            // Récupère le role Partner (2)
            const partnerRole = await getRolePartner();
            // Convertie en JSON et le parser
            const partnerRoleJson = JSON.stringify(partnerRole);
            const partnerRoleResult = JSON.parse(partnerRoleJson);
            // Mettre les données dans une nouvelle entité Role
            roleEntity.id = partnerRoleResult[0]['id'];
            roleEntity.name = partnerRoleResult[0]['name'];
            // Récupérer les informations de la table partnerrequest
            const getDataPartner = await getPartnershipRequestById(id);
            const partnerDataJson = JSON.stringify(getDataPartner);
            const getResultPartner = JSON.parse(partnerDataJson);
            userEntity.firstname = getResultPartner['firstname'];
            userEntity.lastname = getResultPartner['lastname'];
            userEntity.username = getResultPartner['username'];
            userEntity.email = getResultPartner['email'];
            userEntity.password = getResultPartner['password'];
            userEntity.role = roleEntity;
            addressEntity.address = getResultPartner['address'];
            addressEntity.postcode = getResultPartner['postcode'];
            addressEntity.city = getResultPartner['city'];
            const user = await insertUser(userEntity);
            addressEntity.user = userEntity;
            const address = await insertAddress(addressEntity);
            return ({
                user,
                address,
            });
        } catch (e) {
            console.log(e);
        }
    }

    static async login(req : Request, res : Response) {
        const usernameOrEmail = req.body.username;
        const password = req.body.password;
        try {
            const user = await getUserByCredential(usernameOrEmail);
            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result === true) {
                        req.session.loggedin = true;
                        req.session.username = usernameOrEmail;
                        res.status(200).json({
                            user : [user]
                        });
                        return;
                    } else {
                        console.log(result);
                        res.status(403).json({
                            message : 'Mot de passe incorrect'
                        });
                        return;
                    }
                });
            } else {
                res.status(404).json({
                    message : 'Email ou pseudo incorrect'
                });
                return;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static logout(req : Request, res : Response) {
        req.session = null;
        res.send('logout ok');
    }

    static async resetPassword(req : Request, res : Response) {
        const email = req.body.email;
        console.log(email);
        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : 'seb.hitema@gmail.com',
                pass : 'sebsebseb'
            }
        });

        try {
            const checkEmail = await getUserByCredential(email);
            if (checkEmail) {
                const password = generator.generate({
                    length : 10,
                    numbers : true
                });

                const mailOptions = {
                    from : 'seb.hitema@gmail.com',
                    to : email,
                    subject : 'Nouveau mot de passe',
                    html : '<p>Voici votre nouveau mot de passe : ' + '<b>' + password + '</b>' + '</p><p>Vous pouvez le changer sur la page profil</p>'
                };

                const passwordHash = bcrypt.hashSync(password, 10);

                transporter.sendMail(mailOptions, async function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        await resetPassword(email, passwordHash);
                        res.status(200).json({
                            message : 'Envoi réussi'
                        });
                        return;
                    }
                });
            } else {
                res.status(404).json({
                    message : 'Cette adresse mail n\'éxiste pas dans la base'
                });
                return;
            }
        } catch (e) {
            console.log('bouffoooon');
        }
    }

    static async updateUser(req : Request, res : Response) {
        let id = req.params.id;
        const userData = req.body;
        try {
            await getRepository(User).update(id, userData);
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

    static async deleteUserWithAdress(req : Request, res : Response) {
        let id = req.params.id;
        try {
            await getRepository(User).delete(id);
            return res.status(200).json({
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

export default UserController;