import { RecoveryState } from '../type/RecoveryState';

export interface IRecovery {
    idMold : number;
    recoveryNumber : string;
    recoveryState : RecoveryState;
}