import { Router } from 'express';
import AddressController from '../controller/AddressController';
import IngredientController from '../controller/IngredientController';
import IngredientMoldController from '../controller/IngredientMoldController';
import MoldController from '../controller/MoldController';
import PartnerRecoveryController from '../controller/PartnerRecoveryController';
import PartnershipRequestController from '../controller/PartnershipRequestController';
import RecoveryController from '../controller/RecoveryController';
import RewardController from '../controller/RewardController';
import RoleController from '../controller/RoleController';
import UserController from '../controller/UserController';
import MailController from '../controller/MailController';

export const router = Router();

router.get('/user', UserController.getAllUsers);
router.get('/user/:id', UserController.getUserById);
router.post('/user', UserController.insertCustomerAndAddress);
router.post('/user/login', UserController.login);
router.get('/user/logout', UserController.logout);
router.post('/user/passwordReset', UserController.resetPassword);
router.put('/user/:id', UserController.updateUser);
router.delete('/user/:id', UserController.deleteUserWithAdress);

router.get('/address', AddressController.getAllAddress);
router.get('/address/:id', AddressController.getAddressByUsers);
router.put('/address/:id', AddressController.updateAddressByIdUser);

router.get('/role', RoleController.getAllRoles);

router.get('/partner', PartnershipRequestController.getAllPartnershipRequests);
router.get('/partner/:id', PartnershipRequestController.getPartnershipRequestById);
router.post('/partner', PartnershipRequestController.insertPartnershipRequest);
router.put('/partner/:id/denied', PartnershipRequestController.partnerRequestDenied);
router.put('/partner/:id/granted', PartnershipRequestController.partnerRequestGranted);

router.get('/partnerRecovery', PartnerRecoveryController.getAll);

router.get('/mold', MoldController.getAll);
router.post('/mold', MoldController.insert);
router.post('/mold/give', MoldController.give);
router.post('/mold/take', MoldController.take);
router.delete('/mold/:id', MoldController.delete);

router.get('/recovery', RecoveryController.getAll);
router.post('/recovery/pick', RecoveryController.pick);
router.post('/recovery/validate', RecoveryController.validate);
router.post('/recovery/invalidate', RecoveryController.invalidate);
router.post('/recovery/leave', RecoveryController.leave);

router.get('/partnerRecovery', PartnerRecoveryController.getAll);

router.get('/ingredient', IngredientController.getAll);

router.get('/ingredientMold', IngredientMoldController.getAll);

router.get('/reward', RewardController.getAllRewards);
router.post('/reward', RewardController.insertReward);
router.delete('/reward/:id', RewardController.deleteReward);
router.put('/reward/:id', RewardController.updateReward);

router.post('/sendMail', MailController.sendMail);