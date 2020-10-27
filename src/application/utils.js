import _ from 'lodash';
import stringify from 'csv-stringify/lib/es5';


export const toCSV = (objArray) =>
    stringify(objArray, {
        header: true,
        cast: {
            date: (value) => value.toLocaleString()
        },
    });

export const uniqFlatten = (arr) =>
    _.uniqWith(_.flattenDeep(arr), _.isEqual);

export const hasRelation = async (foreignModel, model, foreignKey) => (await foreignModel.count({ where: { [foreignKey]: model.id } })) >= 1;
