export default function asyncTest(cb) {
    return async function(done) {
        try {
            await cb();
            done();
        } catch (err) {
            done(err);
        }
    }
}
