import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IPartnerRecovery } from '../interface/IPartnerRecovery';
import { Recovery } from './Recovery';
import { User } from './User';

@Entity('partnerrecovery')
export class PartnerRecovery implements Partial<IPartnerRecovery> {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    pickDate : string;

    @OneToOne(type => Recovery, recovery => recovery.id, { onDelete : 'CASCADE' })
    @JoinColumn({ name : 'idRecovery' })
    recovery : Recovery;

    @ManyToOne(type => User, user => user.id, { onDelete : 'CASCADE' })
    @JoinColumn({ name : 'idUser' })
    user : User;
}
