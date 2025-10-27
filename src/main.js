const logger = require('./logger');

logger.log('info', 'This is an informational message.');
logger.log('warn', 'This is a warning message.');
logger.log('error', 'This is an error message.');

logger.info('This is another informational message.');
logger.warn('This is another warning message.');
logger.error('This is another error message.');
