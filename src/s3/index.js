import cfg from '../cfg';
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
    accessKeyId: cfg.s3.accessKeyId,
    secretAccessKey: cfg.s3.secretAccessKey
});

export default {
    uploadImage(id, stream, options) {
        return upload(id, stream, options);
    },

    uploadAudio(id, stream, options) {
        return upload(id, stream, options);
    },

    uploadFile(id, stream, options) {
        return upload(id, stream, options);
    }
};

function upload(key, stream, options) {
    if (process.env.ENV === 'test')
        return Promise.resolve({Location: ''});

    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: cfg.s3.bucket,
            Key: key,
            Body: stream,
            ACL: 'public-read',
            ...options
        }, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    });
}
