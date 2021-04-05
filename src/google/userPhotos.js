import dispatch from "./dispatcher";
import { google } from "googleapis";
import s3 from '../s3';
import GooglePhotoRepository from '../db/repositories/GooglePhotoRepository';
import {v4 as uuid} from "uuid";

const drive = google.drive("v3");

export default async function storeUserPhotos(tokens, user_id) {

    const filesList = await dispatch(drive.files.list.bind(drive.files), tokens, {
        q:"mimeType = 'image/jpeg'",
        fields: "files(id,description)"
    });

    filesList.data.files.map(async file => {

        const stream = await dispatch(drive.files.get.bind(drive.files), tokens, {
            fileId: file.id,
            alt: 'media'
        }, {responseType: "stream"});

        const existingPhoto = await GooglePhotoRepository.getUserPhotoByFileId(user_id, file.id);
        if (existingPhoto) return false;

        const { Location } = await s3.uploadImage(file.id, stream.data);

        if (Location) {
            GooglePhotoRepository.createUserPhoto({
                id: uuid(),
                user_id,
                file_id: file.id,
                description: file.description || "",
                image: Location
            });
        }

    });

}
