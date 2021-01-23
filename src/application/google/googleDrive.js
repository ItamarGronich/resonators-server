const {google} = require('googleapis');
const { JWT } = require('google-auth-library');

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

    /**
     * Lists the names and IDs of up to 100 files inside the specified folder.
     */
    async listFiles(folderId) {
        const auth = this.jwtClient;
        const drive = google.drive({version: 'v3', auth});
        const list = await drive.files.list({
            pageSize: 100,
            fields: 'files(id, name)',
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: `'${folderId}' in parents`
        });

        return list.data.files;
    }

    async getFileContent(fileId) {
        const auth = this.jwtClient;
        const drive = google.drive({version: 'v3', auth});
        const file =  await drive.files.export({
            fileId: fileId,
            mimeType: "text/plain"
        });

        return file.data;
    }

}

export default googleDrive;
