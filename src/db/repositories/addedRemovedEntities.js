import _ from 'lodash';

export default function addRemoveChangedEntities({
    currentGroup,
    previousGroup,
    dbModel,
    transaction
}) {
    const {
        addedEntities,
        removedEntities
    } = getAddedRemovedEntities(currentGroup, previousGroup);

    const addEntitiesPromises = addedEntities.map(e => dbModel.create(e, {transaction}));
    const removedEntitiesPromises = removedEntities.map(e => dbModel.destroy({
        where: {
            id: e.id
        }
    }, {transaction}));

    return [...addEntitiesPromises, ...removedEntitiesPromises];
}

export function getAddedRemovedEntities(c1 = [], c2 = []) {
    return [...c1, ...c2].reduce((acc, cur) => {
        if (!_.find(c2, e => e.id === cur.id))
            acc.addedEntities.push(cur);
        else if (!_.find(c1, e => e.id === cur.id))
            acc.removedEntities.push(cur);

        return acc;
    }, {
        addedEntities: [],
        removedEntities: []
    });
}
