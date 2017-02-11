const loadOrder = [
    './users.js',
    './user_logins',
    './leaders',
    './clinics',
    './followers',
    './resonators',
    './resonator_attachments',
    './questions',
    './answers'
];

const promiseChain = () => {
    return loadOrder.reduce((acc, cur) => {
        return acc.then(() => require(cur).default());
    }, Promise.resolve());
};

export default () => {
    console.log('loading fixtures...')
    return promiseChain()
               .then(() => console.log('fixtures loaded.'));
};
