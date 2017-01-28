import createDbFixtures from '../dbFixtures';

before(done => {
    createDbFixtures()
        .then(() => done())
        .catch(done);
});
