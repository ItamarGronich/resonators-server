import express from '../express';
import routeHandler from '../routeHandler';

import {
    updateFollowerGroup,
    getLeaderFollowerGroups,
    addLeaderFollowerGroup,
    deleteLeaderFollowerGroup,
    getLeader,
    getGroupFollowers,
    updateGroupFollowers,
    freezeFollowerGroup,
    unfreezeFollowerGroup
} from '../../application/leaderFollowerGroups';

express.get('/api/leader_followerGroups\.:ext?', routeHandler(async (request, response) => {
    const { leader } = request.appSession;
    const followerGroups = await getLeaderFollowerGroups(leader.id);
    response.json(followerGroups);
}));

express.get('/api/leader_followerGroups/leaders.:ext?', routeHandler(async (request, response) => {
    const { leader } = request.appSession;
    const leaders = await getLeader(leader.id);
    response.json(leaders);
}));

express.post('/api/leader_followerGroups\.:ext?', routeHandler(async (request, response) => {
    const { leader } = request.appSession;
    const followerGroupRequest = request.body;
    const followerGroupRequestWithLeader = Object.assign({}, followerGroupRequest, { leader_id: leader.id });

    const followerGroup = await addLeaderFollowerGroup(followerGroupRequestWithLeader);

    response.status(201).json(followerGroup);
}));

express.put('/api/leader_followerGroups/:followerGroupId\.:ext?', routeHandler(async (request, response) => {
    const { followerGroupId } = request.params;
    const updatedFollowerGroup = await updateFollowerGroup(followerGroupId, request.body);
    response.status(202).json(updatedFollowerGroup);
}, {
    enforceLeaderFollowerGroup: true
}));

express.delete('/api/leader_followerGroups/:followerGroupId\.:ext?', routeHandler(async (request, response) => {
    const { followerGroupId } = request.params;
    const result = await deleteLeaderFollowerGroup(followerGroupId);
    response.status(result ? 200 : 422).json();
}, {
    enforceLeaderFollowerGroup: true
}));

express.get('/api/leader_followerGroups/:followerGroupId/followers\.:ext?', routeHandler(async (request, response) => {
    const { followerGroupId } = request.params;
    const followers = await getGroupFollowers(followerGroupId);
    response.json(followers);
}, {
    enforceLeaderFollowerGroup: true
}));

express.put('/api/leader_followerGroups/:followerGroupId/followers\.:ext?', routeHandler(async (request, response) => {
    const { followerGroupId } = request.params;
    const { memberIdList } = request.body;
    await updateGroupFollowers(followerGroupId, memberIdList);
    response.status(202).json();
}, {
    enforceLeaderFollowerGroup: true
}));

express.post('/api/leader_followerGroups/:followerGroupId/freeze\.:ext?', routeHandler(async (request, response) => {
    const { followerGroupId } = request.params;

    const result = await freezeFollowerGroup(followerGroupId);

    response.status(result ? 200 : 422);
    response.json({});
}, {
    enforceLeaderFollower: true
}));

express.post('/api/leader_followerGroups/:followerGroupId/unfreeze\.:ext?', routeHandler(async (request, response) => {
    const { followerGroupId } = request.params;

    const result = await unfreezeFollowerGroup(followerGroupId);

    response.status(result ? 200 : 422);
    response.json({});
}, {
    enforceLeaderFollower: true
}));
