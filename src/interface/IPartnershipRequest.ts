import { RequestState } from '../type/RequestState';

export interface IPartnershipRequest {
    firstname : string;
    lastname : string;
    email : string;
    password : string;
    username : string;
    address : string;
    postcode : number;
    city : string;
    motivation : string;
    submittedDate : string;
    requestState : RequestState;
}