import { convertStatsToCSV } from '../../application/resonatorStats';


export const sendCsvDownload = async (response, data, type, filename) => {
    response.setHeader('Content-Type', type);
    response.setHeader('Content-Disposition', `attachment; filename="${filename}`);
    convertStatsToCSV(data).pipe(response);
};
