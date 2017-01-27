import Sequelize from 'sequelize';
import cfg from './cfg';

const {username, address, port, database} = cfg.db;

export default new Sequelize(`postgres://${username}@${address}:${port}/${database}`);
