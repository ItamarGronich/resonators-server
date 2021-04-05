import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {google_photos} from '../sequelize/models';
import GoogleDrive from "../../application/google/googleDrive";
import cfg from "../../cfg";

class GooglePhotoRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(entity) {
        return {
            ...entity
        };
    }

    save(googlePhoto, transaction) {
        return google_photos.upsert(googlePhoto, {transaction});
    }

    async getUserPhotos(user_id) {
        const photos = await google_photos.findAll({ where: {user_id} });

        return photos.map(dbToDomain.toGooglePhoto);
    }

    async getSystemPhotos() {
        const drive = new GoogleDrive(cfg.googleDriveAccount);
        const photos = await drive.listFiles(cfg.photosFolderId);
        return await Promise.all(photos.map(async (photo) => {
            const arraybuffer = await drive.getFile(photo.id, {alt: "media"});
            const base64Image = Buffer.from(arraybuffer, 'binary').toString('base64');
            return {
                ...photo,
                image: "data:image/jpeg;base64," + base64Image
            }
        }));
    }

    async getUserPhotoByFileId(user_id, file_id) {
        return await await google_photos.findOne({where: {user_id, file_id}});
    }

    async createUserPhoto(transaction) {
        return await google_photos.upsert(transaction);
    }

}

export default new GooglePhotoRepository();
