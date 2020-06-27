import { expect, should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import httpStatus from 'http-status';
import moment from 'moment';
import request from 'supertest-as-promised';
import app from '../../index';
import { getAllPartnershipRequest } from '../../src/helper/partnerHelpers';
import { IPartnershipRequest } from '../../src/interface/IPartnershipRequest';
import { RequestState } from '../../src/type/RequestState';

should();
use(chaiAsPromised);

describe('Partner test Suite', () => {
    describe('/POST partner', () => {
        const random =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const partnershipRequest : Partial<IPartnershipRequest> = {
            address : '8 rue du paradis',
            city : 'paris',
            email : random + '@gmail.com',
            firstname : 'kat',
            lastname : 'kat',
            motivation : 'votre projet nous interesse',
            postcode : 98000,
            requestState : RequestState.Sent,
            username : random
        };
        it('should return the created partner Request successfully ', (done) => {
            request(app)
                .post('/partner')
                .send({
                    ...partnershipRequest,
                    password : 'yeees452',
                    submittedDate : moment().locale('fr').format('DD-MM-YY HH:mm:ss'),
                })
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.partnershipRequest).to.include(partnershipRequest);
                    done();
                });
        });
    });
    describe('/PUT partner', () => {
        it('should return partner request with RequestState denied', async () => {
            const getIdPartner = await getAllPartnershipRequest();
            const id = getIdPartner[0]['id'];
            request(app)
                .put(`/partner/${id}/denied`)
                .expect(httpStatus.OK)
                .then();
        });
        it('should return partner request with RequestState granted', async () => {
            const getIdPartner = await getAllPartnershipRequest();
            const id = getIdPartner[0]['id'];
            request(app)
                .put(`/partner/${id}/granted`)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.callInsertPartner.user).to.not.be.undefined;
                    expect(res.body.callInsertPartner.address).to.not.be.undefined;
                });
        });
    });
});
