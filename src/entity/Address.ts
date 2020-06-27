import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IAddress } from '../interface/IAddress';
import { User } from './User';

@Entity('address')
export class Address implements Partial<IAddress> {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    address : string;

    @Column()
    postcode : number;

    @Column()
    city : string;

    @ManyToOne(type => User, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name : 'idUser' })
    user : User;

}
