const formatDate = () => new Date().toISOString();

const createLog = (level, ...args) => {
  console.log(`[${formatDate()}] [${level}]`, ...args);
};

export const logger = {
  info: (...args) => createLog('INFO', ...args),
  error: (...args) => createLog('ERROR', ...args),
  warn: (...args) => createLog('WARN', ...args),
};
