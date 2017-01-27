import Sequelize from 'sequelize';
import api from './api/express';

api.set('port', (process.env.PORT || 8080));

require('./api/users');
require('./api/login');

api.listen(api.get('port'), '0.0.0.0', function() {
    console.log('Node app is running on port', api.get('port'));
});
