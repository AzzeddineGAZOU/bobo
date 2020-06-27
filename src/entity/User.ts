import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../interface/IUser';
import { Address } from './Address';
import { Role } from './Role';
import { Reward } from './Reward';

@Entity('user')
export class User implements Partial<IUser> {

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

    @ManyToOne(type => Role, role => role.id)
    @JoinColumn({ name : 'idRole' })
    role : Role;

    @Column({ nullable : true })
    avatar? : string;

    @OneToMany(type => Address, address => address.user, { onDelete: 'CASCADE' })
    address : Address[];

    @OneToMany(type => Reward, reward => reward.user, { onDelete: 'CASCADE' })
    reward : Reward[];

}
