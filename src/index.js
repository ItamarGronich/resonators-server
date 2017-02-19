import Sequelize from 'sequelize';
import api from './api';
import startEmailScheduler from './emailScheduler';

startEmailScheduler();

api.set('port', (process.env.PORT || 8080));

api.listen(api.get('port'), '0.0.0.0', function() {
    console.log('Node app is running on port', api.get('port'));
});
