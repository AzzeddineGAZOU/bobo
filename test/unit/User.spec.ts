import { expect, should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import app from '../../index';
import { getAllUsers } from '../../src/helper/userHelpers';
import { IAddress } from '../../src/interface/IAddress';
import { IUser } from '../../src/interface/IUser';

should();
use(chaiAsPromised);
describe('User test Suite', () => {
    describe('/POST users', () => {
        const random =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const user : Partial<IUser> = {
            email : random + '@gmail.com',
            firstname : 'daniel',
            lastname : 'dani',
            username : random
        };
        const address : Partial<IAddress> = {
            address : 'rue du paradis',
            city : 'Sarcelles',
            postcode : 95210,
        };
        const data = {
            email : random + '@gmail.com',
            firstname : 'daniel',
            lastname : 'dani',
            password : 'ajaja',
            username : random,
            address : 'rue du paradis',
            city : 'Sarcelles',
            postcode : 95210,
        };
        it('should return the created user and his address successfully ', (done) => {
            request(app)
                .post('/user')
                .send({
                    ...data
                })
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.user).to.include(user);
                    expect(res.body.address).to.include(address);
                    done();
                });
        });
        it('should return 200 if connected ', (done) => {
            request(app)
                .post('/user/login')
                .send({
                    username : random,
                    password : 'ajaja'
                })
                .expect(httpStatus.OK)
                .then(res => {
                    console.log('test' + random);
                    console.log(res);
                    done();
                });
        });
        it('should return 400 if postcode !== 5 ', (done) => {
            request(app)
                .post('/user')
                .send({
                    ...data,
                    postcode : 9521000
                })
                .expect(httpStatus.BAD_REQUEST)
                .then(res => {
                    done();
                });
        });
        it('should return 400 if email format not correct ', (done) => {
            request(app)
                .post('/user')
                .send({
                    ...data,
                    email : 'blablablabla'
                })
                .expect(httpStatus.BAD_REQUEST)
                .then(res => {
                    done();
            });
        });
       it('should return 200 if email ResetPassword was sent  ', async () => {
            const user = await getAllUsers();
            const email = user[0]['email'];
            request(app)
                .post('/user/passwordReset')
                .send({
                    email : email
                })
                .expect(httpStatus.OK)
                .end();
        });
    });

});
