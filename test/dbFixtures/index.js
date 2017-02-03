const fixtures = [
    () => require('./users.js').default().then(() => require('./user_logins').default())
];

export default () => {
    const promises = fixtures.map(f => f());
    return Promise.all(promises);
};
