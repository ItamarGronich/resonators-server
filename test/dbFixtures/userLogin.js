import userLogin from '../../src/dbModels/userLogin';

export default () => {
    return userLogin.sync({force: true});
};
