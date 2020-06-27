import { Identified } from './Identified';

export type FilterFunction<T> = (element : Identified<T>) => boolean;