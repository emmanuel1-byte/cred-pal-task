"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./src/utils/database"));
const logger_1 = __importDefault(require("./src/utils/logger"));
const node_http_1 = require("node:http");
const server = (0, node_http_1.createServer)(app_1.default);
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    await (0, database_1.default)();
    logger_1.default.info(`Server successfully started and listening on port ${PORT}. Environment: ${process.env.NODE_ENV}`);
});
