export default async function enforceFollower(request, response) {
    const follower = request.appSession.follower;

    if (!follower) {
        response.status(405).json({
            status: "Must be a follower to perform this action",
        });
    }

    return Boolean(follower);
}
