import express from '../express';
import routeHandler from '../routeHandler';
import GoogleContactRepository from '../../db/repositories/GoogleContactRepository';
import GooglePhotoRepository from '../../db/repositories/GooglePhotoRepository';

express.get('/api/getUserGoogleContacts', routeHandler(async (request, response) => {
    const {user} = request.appSession;
    const userContacts = await GoogleContactRepository.getUserContacts(user.id);

    response.status(200);
    response.json(userContacts);
}));

express.get('/api/getUserGooglePhotos', routeHandler(async (request, response) => {
    const {user} = request.appSession;
    const userPhotos = await GooglePhotoRepository.getUserPhotos(user.id);

    response.status(200);
    response.json(userPhotos);
}));

express.get('/api/getSystemGooglePhotos', routeHandler(async (request, response) => {
    const systemPhotos = await GooglePhotoRepository.getSystemPhotos();

    response.status(200);
    response.json(systemPhotos);
}));
