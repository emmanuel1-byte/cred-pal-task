import { connect } from "mongoose";
import logger from "./logger";
import { config } from "dotenv";
config();

async function connectDatabase() {
  try {
    await connect(process.env.MONGO_URI as string);
    logger.info("Database connection successfull");
  } catch (err: any) {
    logger.error(err);
    throw new Error(err);
  }
}

export default connectDatabase;
