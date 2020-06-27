import { Identified } from './Identified';

export type IdentifiedMapObject<T> = { [key : string] : Identified<T> };