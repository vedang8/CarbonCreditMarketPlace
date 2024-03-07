function analyzeAccessLogs(logFilePath) {
    const logs = fs.readFileSync(logFilePath, 'utf8').split('\n');
  
    // Initialize metrics variables
    let numRequests = 0;
    let totalDataSize = 0;
    let finishTimes = [];
  
    // Parse each log entry
    logs.forEach(log => {
      const parts = log.split(' ');
      const method = parts[5].replace(/"/g, '');
      const statusCode = parts[8];
      const contentLength = parseInt(parts[9], 10);
      const finishTime = new Date(parts[3].slice(1) + ' ' + parts[4].slice(0, -1));
  
      // Increment request count for successful requests
      if (method === 'GET' && (statusCode >= 200 && statusCode < 300)) {
        numRequests++;
        totalDataSize += contentLength;
        finishTimes.push(finishTime);
      }
    });
  
    // Calculate finish time metrics
    const minFinishTime = new Date(Math.min(...finishTimes));
    const maxFinishTime = new Date(Math.max(...finishTimes));
    const avgFinishTime = finishTimes.reduce((acc, time) => acc + time.getTime(), 0) / finishTimes.length;
  
    // Output metrics
    console.log('Number of requests:', numRequests);
    console.log('Total data size transferred:', totalDataSize, 'bytes');
    console.log('Minimum finish time:', minFinishTime);
    console.log('Maximum finish time:', maxFinishTime);
    console.log('Average finish time:', new Date(avgFinishTime));
}
  
export default analyzeAccessLogs;