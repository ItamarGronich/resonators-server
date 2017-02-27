import {Repository} from 'ddd-helpers';
import getUow from '../../application/getUow';

export default class ResonatorsRepository extends Repository {
    constructor() {
        super(getUow);
    }
}
