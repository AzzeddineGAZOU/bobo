import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { IIngredient } from '../interface/IIngredient';
import { IngredientMold } from './IngredientMold';
import { Mold } from './Mold';

@Entity('ingredient')
export class Ingredient implements Partial<IIngredient> {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    contribution : string;

    @OneToMany(type => IngredientMold, ingredientMold => ingredientMold.ingredient, { onDelete : 'CASCADE' })
    public ingredientMold! : IngredientMold[];

}
