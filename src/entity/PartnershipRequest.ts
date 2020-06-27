import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IPartnershipRequest } from '../interface/IPartnershipRequest';
import { RequestState } from '../type/RequestState';

@Entity('partnershiprequest')
export class PartnershipRequest implements IPartnershipRequest {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    firstname : string;

    @Column()
    lastname : string;

    @Column()
    username : string;

    @Column()
    email : string;

    @Column()
    password : string;

    @Column()
    address : string;

    @Column()
    postcode : number;

    @Column()
    city : string;

    @Column()
    motivation : string;

    @Column()
    submittedDate : string;

    @Column({ type : 'enum', enum : RequestState, nullable : true })
    requestState : RequestState;

}
