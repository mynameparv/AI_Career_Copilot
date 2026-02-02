// REDIS CONFIGURATION - COMMENTED OUT FOR NOW
// Uncomment below to re-enable Redis in the future

/*
import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

await redisClient.connect();

export default redisClient;
*/

// Temporary export to prevent import errors
export default null;
