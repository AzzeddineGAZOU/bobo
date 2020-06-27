import { Identified } from './Identified';
import { Identifier } from './Identifier';

export type ElementOrIdentifier<T> = Identified<T> | Identifier;