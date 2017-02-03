import {Repository} from 'ddd-helpers';

export default class ResonatorsRepository extends Repository {
    constructor() {
        super(() => process.domain.uow);
    }
}
