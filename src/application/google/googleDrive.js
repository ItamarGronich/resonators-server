const {google} = require('googleapis');
const { JWT } = require('google-auth-library');
import { v4 as uuid } from 'uuid';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

class googleDrive {

    constructor(creds) {
        this.useServiceAccountAuth(creds);
    }

    async useServiceAccountAuth(creds) {
        this.jwtClient = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: SCOPES,
            subject: "support@psysession.com",
        });
        await this.renewJwtAuth();
    }

    async renewJwtAuth() {
        await this.jwtClient.authorize();
    }

    async listDrives() {
        try {
            const auth = this.jwtClient;
            const drive = google.drive({version: 'v3', auth});

            let list = await drive.drives.list();
            let drives = list.data.drives;
            while (list.data.nextPageToken) {
                list = await drive.drives.list({
                    pageToken: list.data.nextPageToken
                });
                drives = [...drives, ...list.data.drives];
            }

            return drives;
        } catch (err) {
            console.log(err.errors[0]?.message);
        }
    }

    async createDrive(requestBody) {
        try {
            const auth = this.jwtClient;
            const drive = google.drive({version: 'v3', auth});
            const newDrive = await drive.drives.create({
                requestId: uuid(),
                requestBody
            });

            return newDrive.data;
        } catch (err) {
            console.log(err.errors[0]?.message);
        }
    }

    async createFile(fileMeta) {
        try {
            const auth = this.jwtClient;
            const drive = google.drive({version: 'v3', auth});
            const newFile = await drive.files.create({
                fields: 'id,name,description,driveId,parents,properties,webViewLink',
                resource: fileMeta,
                supportsAllDrives: true
            });

            return newFile.data;
        } catch (err) {
            console.log(err.errors[0]?.message);
        }
    }

    async updateFile(fileMeta) {
        try {
            const auth = this.jwtClient;
            const drive = google.drive({version: 'v3', auth});
            const updatedFile = await drive.files.update(fileMeta);

            return updatedFile.data;
        } catch (err) {
            console.log(err.errors[0]?.message);
        }
    }

    async createPermission(fileId, fileMeta) {
        try {
            const auth = this.jwtClient;
            const drive = google.drive({version: 'v3', auth});
            const permission = await drive.permissions.create({
                fileId,
                resource: fileMeta,
                supportsAllDrives: true,
                sendNotificationEmail: false
            });

            return permission.data;
        } catch (err) {
            console.log(err.errors[0]?.message);
        }
    }
    /**
     * Lists the names and IDs of up to 1000 files inside the specified folder.
     */
    async listFiles(folderId) {
        try {
            const auth = this.jwtClient;
            const drive = google.drive({version: 'v3', auth});
            const listConfig = {
                pageSize: 1000,
                fields: 'files(id,name,description,driveId,parents,properties,webViewLink)',
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
            };
            listConfig.q = (folderId) ? `'${folderId}' in parents and trashed = false` : "trashed = false";
            const list = await drive.files.list(listConfig);

            return list.data.files;
        } catch (err) {
            console.log(err.errors[0]?.message);
        }
    }

    async getFile(fileId, params) {
        try {
            const auth = this.jwtClient;
            const drive = google.drive({version: 'v3', auth});
            const file = await drive.files.get({
                ...params,
                fileId,
            }, {responseType: "arraybuffer"});

            return file.data;
        } catch (err) {
            console.log(err.errors[0]?.message);
        }
    }

    async getFileContent(fileId) {
        try {
            const auth = this.jwtClient;
            const drive = google.drive({version: 'v3', auth});
            const file = await drive.files.export({
                fileId: fileId,
                mimeType: "text/plain"
            });

            return file.data;
        } catch (err) {
            console.log(err.errors[0]?.message);
        }
    }

}

export default googleDrive;
