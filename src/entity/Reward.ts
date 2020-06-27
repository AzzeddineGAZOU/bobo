import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IReward } from '../interface/IReward';
import { User} from './User';

@Entity('reward')
export class Reward implements Partial<IReward>  {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    promoCode : string;

    @Column()
    reduction : number;

    @Column()
    expirationDate : string;

    @ManyToOne(type => User, user => user.id, {onDelete : 'CASCADE'})
    @JoinColumn({name : 'idUser'})
    user: User;

}
