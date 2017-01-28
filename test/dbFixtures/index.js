const fixtures = [
    () => require('./user.js').default().then(() => require('./userLogin').default())
];

export default () => {
    const promises = fixtures.map(f => f());
    return Promise.all(promises);
};
