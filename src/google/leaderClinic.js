import cfg from "../cfg";
import createJob from "../createJob";
import {clinicBuilderLog as log} from "../logging";
import GoogleDrive from "../application/google/googleDrive";
import ClinicRepository from "../db/repositories/ClinicRepository";

const BuildClinicInterval = 120 * 1000;

export default createJob({
    runner: buildClinicGoogleDrive,
    interval: BuildClinicInterval,
    onStart: () => log.info(`Starting with interval of ${BuildClinicInterval} ms`),
    onStop: () => log.info('Stopping'),
    onError: log.error,
});

async function buildClinicGoogleDrive() {
    try {
        log.info('Clinics Sync starting...');
        const Drive = new GoogleDrive(cfg.googleDriveAccount);
        const drives = await Drive.listDrives();
        const clinics = await ClinicRepository.findAllClinicsRaw();
        const allDrivesFiles = await Drive.listFiles();

        allDrivesFiles.map((file) => { // attach files to their drives
            const parentDrive = drives.find(drive => drive.id === file.driveId);
            if (parentDrive) {
                if (!parentDrive.files) parentDrive.files = [];
                parentDrive.files.push(file);
            }
        });

        clinics.map(async (clinic) => {
            if (!clinic.leader_name) return;
            let existingDrive = drives.find(drive => drive.name === clinic.name);
            if (!existingDrive) { // create clinic drive if it doesn't exist yet
                existingDrive = await Drive.createDrive({name: clinic.name});
                await Drive.createPermission(existingDrive.id, {type: 'user', emailAddress: clinic.leader_email, role: 'organizer'});
                drives.push(existingDrive);
            }
            let leaderFolder = existingDrive.files?.find(file => file.parents.includes(existingDrive.id) && file.properties?.id === clinic.leader_id);
            if (!leaderFolder) { // create leader folder if it doesn't exist yet
                leaderFolder = await Drive.createFile({
                    properties: {id: clinic.leader_id},
                    name: clinic.leader_name,
                    mimeType: "application/vnd.google-apps.folder",
                    parents: [existingDrive.id]
                });
            }

            let inactiveFollowersFolder = existingDrive.files?.find(file => file.parents.includes(leaderFolder.id) && file.name === "Inactive Followers");
            if (!inactiveFollowersFolder) { // create inactive followers folder if it doesn't exist yet
                inactiveFollowersFolder = await Drive.createFile({
                    name: "Inactive Followers",
                    mimeType: "application/vnd.google-apps.folder",
                    parents: [leaderFolder.id]
                });
            }

            const followers = await ClinicRepository.findClinicFollowersRaw(clinic.id);
            followers.map(async (follower) => {
                const followerParent = follower.frozen ? inactiveFollowersFolder.id : leaderFolder.id;
                let existingFollower = existingDrive.files?.find(file => file.driveId === existingDrive.id && file.properties?.id === follower.id);

                if (!existingFollower) { // create follower folder if it doesn't exist yet
                    existingFollower = await Drive.createFile({
                        properties: {id: follower.id},
                        name: follower.name,
                        mimeType: "application/vnd.google-apps.folder",
                        parents: [followerParent]
                    });
                    await ClinicRepository.addFollowerGDriveLink(follower.id, existingFollower.webViewLink);
                } else if (!existingFollower.parents.includes(followerParent)) { // move the follower if they're in the wrong folder (active||inactive)
                    await Drive.updateFile({
                        fileId: existingFollower.id,
                        addParents: [followerParent],
                        removeParents: existingFollower.parents,
                        supportsAllDrives: true
                    });
                }

                let systemTemplatesFolder = existingDrive.files?.find(file => file.parents.includes(existingFollower.id) && file.name === "System Follower Templates");
                if (!systemTemplatesFolder) { // create system follower templates folder if it doesn't exist yet
                    systemTemplatesFolder = await Drive.createFile({
                        name: "System Follower Templates",
                        mimeType: "application/vnd.google-apps.folder",
                        parents: [existingFollower.id]
                    });
                }
            });
        });
        log.info('Clinics Sync complete!');
    } catch (err) {
        log.error(err);
    }
}
