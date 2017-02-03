import Sequelize from 'sequelize';
import cfg from '../../cfg';

const {username, host, database, options = {}} = cfg.db;

export default new Sequelize(`postgres://${username}@${host}/${database}`, options);
