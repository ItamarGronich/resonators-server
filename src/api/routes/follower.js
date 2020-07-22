import express from '../express';

import routeHandler from '../routeHandler';
import { getResonators } from '../../application/resonators'


express.get('/api/follower/resonators', routeHandler(async (request, response) => {
    const follower = request.appSession.follower;
    // In case the user is not a follower, he gets no resonators
    const followerResonators = follower ? await getResonators(follower.id) : [];
    const activeResonators = followerResonators.filter(resonator => resonator.pop_email);

    response.status(200);
    response.json({ resonators: activeResonators });
}));
