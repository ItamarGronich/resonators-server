const enforcementMap = {
    enforceLogin: require("./enforceLogin").default,
    enforceLeaderFollower: require("./enforceLeaderFollowers").default,
    enforceLeaderResonator: require("./enforceLeaderResonator").default,
    enforceFollower: require("./enforceFollower").default,
    enforceFollowerResonator: require("./enforceFollowerResonator").default,
};

export default async function enforcePermissionPolicy(request, response, options = {}) {
    const enforcers = Object.keys(options)
        .filter((key) => options[key])
        .map((k) => enforcementMap[k]);

    for (let enforcer of enforcers) {
        if (!(await enforcer(request, response))) return;
    }

    return true;
}
