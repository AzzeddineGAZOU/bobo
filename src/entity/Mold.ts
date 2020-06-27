import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IMold } from '../interface/IMold';
import { IngredientMold } from './IngredientMold';
import { User } from './User';

@Entity('mold')
export class Mold implements Partial<IMold> {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    pickable : boolean;

    @Column()
    compositionDate : string;

    @Column()
    pickUpAddress : string;

    @Column()
    quantity : number;

    @ManyToOne(type => User, user => user.id, { onDelete : 'CASCADE' })
    @JoinColumn({ name : 'idUser' })
    user : User;

    @OneToMany(type => IngredientMold, ingredientMold => ingredientMold.mold, { onDelete : 'CASCADE' })
    public ingredientMold! : IngredientMold[];

}
