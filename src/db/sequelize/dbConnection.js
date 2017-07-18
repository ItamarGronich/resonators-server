import Sequelize from 'sequelize';
import cfg from '../../cfg';

const {username, password, host, database, options = {}} = cfg.db;

export default new Sequelize(`postgres://${username}${password ? ':' + password : ''}@${host}/${database}`, options);
