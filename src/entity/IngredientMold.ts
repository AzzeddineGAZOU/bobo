import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from './Ingredient';
import { Mold } from './Mold';

@Entity()
export class IngredientMold {
    @PrimaryGeneratedColumn()
    public id! : number;

    @ManyToOne(type => Ingredient, ingredient => ingredient.ingredientMold, { onDelete : 'CASCADE' })
    @JoinColumn({ name : 'idIngredient' })
    public ingredient! : Ingredient;

    @ManyToOne(type => Mold, mold => mold.ingredientMold, { onDelete : 'CASCADE' })
    @JoinColumn({ name : 'idMold' })
    public mold! : Mold;
}