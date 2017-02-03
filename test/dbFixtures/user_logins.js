import userLogin from '../../src/db/dbModels/userLogin';

export default () => {
    return userLogin.sync({force: true});
};
