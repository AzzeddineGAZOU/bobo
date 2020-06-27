import { should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import app from '../../index';
import { getAllRewards } from '../../src/helper/rewardHelper';
import { getAllUsers } from '../../src/helper/userHelpers';

should();
use(chaiAsPromised);
describe('Reward test Suite', () => {
    describe('/POST reward', async () => {
        it('should return 200 the created reward ', async () => {
            const user = await getAllUsers();
            const id = user[0]['id'];
            request(app)
                .post('/reward')
                .send({
                    promoCode : 'Promo',
                    reduction : 15,
                    expirationDate : '30-06-2020 00:00:00',
                    idUser : id
                })
                .expect(httpStatus.OK)
                .then();
        });
    });
    describe('/Put reward', async () => {
        it('should return 200 when reward has been modified', async () => {
            const reward = await getAllRewards();
            const id = reward[0]['id'];
            request(app)
                .put(`/reward/${ id }`)
                .send({
                    promoCode : 'PromoMODIFIER',
                    reduction : 5,
                    expirationDate : '30-07-2020 00:00:00'
                })
                .expect(httpStatus.OK)
                .then();
        });
    });
    describe('/Delete reward', async () => {
        it('should return 200 when reward has been deleted', async () => {
            const reward = await getAllRewards();
            const id = reward[0]['id'];
            request(app)
                .delete(`/reward/${ id }`)
                .expect(httpStatus.OK)
                .then();
        });
    });
});
