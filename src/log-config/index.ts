import {NODE_ENV} from "../utils/constants.ts";

const logger = {
    log: (message: any) => {
        if (NODE_ENV !== "production") {
            console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
        }
    },
    error: (message: any) => {
        if (NODE_ENV !== "production") {
            console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
        }
    },
    warn: (message: any) => {
        if (NODE_ENV !== "production") {
            console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
        }
    },
    table: (message: any) => {
        if (NODE_ENV!== "production") {
            console.table(
                `
                [TABLE] ${new Date().toISOString()}: ${message}
                `
            );
        }
    }
};

export default logger;
