import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { IRecovery } from '../interface/IRecovery';
import { Mold } from './Mold';
import { User } from './User';
import { RecoveryState } from '../type/RecoveryState';

@Entity('recovery')
export class Recovery implements Partial<IRecovery> {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    recoveryState : RecoveryState;

    @Column()
    recoveryNumber : string;

    @OneToOne(type => Mold, mold => mold.id, { onDelete : 'CASCADE' })
    @JoinColumn({ name : 'idMold' })
    mold : Mold;
}
