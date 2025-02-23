const logger = {
    log: (message: any) => {
        if (process.env.NODE_ENV !== "production") {
            console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
        }
    },
    error: (message: any) => {
        if (process.env.NODE_ENV !== "production") {
            console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
        }
    },
    warn: (message: any) => {
        if (process.env.NODE_ENV !== "production") {
            console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
        }
    },
};

export default logger;
