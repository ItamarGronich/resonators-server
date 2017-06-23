import app from './../src/api/index';
import * as supertestWrapper from './api/supertestWrapper';

before(done => {
    supertestWrapper.init(app);
    done();
});
