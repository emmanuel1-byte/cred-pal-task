import app from "./app";
import connectDatabase from "./src/utils/database";
import logger from "./src/utils/logger";
import { createServer } from "node:http";

const server = createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  await connectDatabase();
  logger.info(
    `Server successfully started and listening on port ${PORT}. Environment: ${process.env.NODE_ENV}`
  );
});
