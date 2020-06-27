import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IRole } from '../interface/IRole';

@Entity('role')
export class Role implements IRole {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;
}
