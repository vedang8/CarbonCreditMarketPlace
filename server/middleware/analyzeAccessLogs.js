const fs = require('fs');
const calculateCarboncredits = require('../middleware/calculateCarbonCredits');

function analyzeAccessLogs(logFilePath) {
    try {
        const logs = fs.readFileSync(logFilePath, 'utf8').split('\n');

        // Initialize metrics variables
        let numRequests = 0;
        let totalDataSize = 0;

        // Parse each log entry
        logs.forEach(log => {
            const parts = log.split(' ');
            if (parts.length >= 10) {
                const method = parts[5].replace(/"/g, '');
                const statusCode = parts[8];
                const contentLength = parseInt(parts[9], 10);

                // Increment request count for successful requests
                if (method == 'GET' || method == 'POST' || method == 'PUT' || method == 'DELETE' && (statusCode >= 200 && statusCode <= 304)) {
                    numRequests++;
                    totalDataSize += contentLength;
                }
            }
        });

        const cc = parseInt(calculateCarboncredits(numRequests, totalDataSize));
        console.log("gdcbuisdcnsuo", cc);
        return cc;
    } catch (error) {
        console.error('Error occurred during access log analysis:', error);
    }
}

module.exports = analyzeAccessLogs;