export default function promisify(fn, params, options) {
    return new Promise((resolve, reject) => {
        fn(params, options, (err, result) => {
            if (err)
                return reject(err);

            resolve(result);
        });
    });
}
