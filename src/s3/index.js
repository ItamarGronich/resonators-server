import cfg from '../cfg';
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
    accessKeyId: cfg.s3.accessKeyId,
    secretAccessKey: cfg.s3.secretAccessKey
});

export default {
    uploadImage(id, stream) {
        return upload(id, stream);
    },

    uploadAudio(id, stream) {
        return upload(id, stream);
    }
};

function upload(key, stream) {
    if (process.env.ENV === 'test')
        return Promise.resolve();

    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: cfg.s3.bucket,
            Key: key,
            Body: stream,
            ACL: 'public-read'
        }, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    });
}
