import { IdentifiedMapObject } from '../type/IdentifiedMapObject';
import { Identifier } from '../type/Identifier';

export interface INormalizedData<T> {
    byId : IdentifiedMapObject<T>;
    allIds : Identifier[];
}