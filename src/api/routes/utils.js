import { convertStatsToCSV } from '../../application/resonatorStats';


export const sendCsvDownload = async (response, data, type, filename) => {
    response.setHeader('Content-Type', type);
    response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}`);
    convertStatsToCSV(data).map((stat, i, arr) => {
        stat.on('readable', () => {
            const row = stat.read();
            if (row) response.write(row);
            if (arr.length === (i + 1)) {
                response.end();
            }
        });
    });
    setTimeout(() => response.end(), 30000); //30sec kill switch in case if there's no readable event registered
};
