import express from 'express';
import compressionMiddleware from 'compression';
import cookieParserMiddleware from 'cookie-parser'
import requestIdMiddleware from 'express-request-id';
import Sequelize from 'sequelize';

const app = express();

app.use(compressionMiddleware());
app.use(cookieParserMiddleware());
app.use(requestIdMiddleware());

var sequelize = new Sequelize('postgres://postgres@localhost:5432/r_d');

var User = sequelize.define('user', {
  firstName: {
      type: Sequelize.STRING,
      field: 'name'
    }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

User.sync({force: true}).then(function () {
    console.log('ggg', User)
});

app.get('/foo/:p', (request, response) => {
    response.status(200);

    response.json({
        foo: request.params('p')
    });
});

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Node app is running on port', app.get('port'));
});
