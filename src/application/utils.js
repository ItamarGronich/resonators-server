import Papa from 'papaparse';
import _ from 'lodash';


export const toCSV = (objArray) =>
    Papa.unparse(objArray, { quotes: false, header: true });

export const uniqFlatten = (arr) =>
    _.uniqWith(_.flattenDeep(arr), _.isEqual);
