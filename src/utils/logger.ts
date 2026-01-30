import winston from "winston";
const { combine, timestamp, prettyPrint, colorize } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint(), colorize()),
  transports: [
    new winston.transports.File({ filename: "log/error.log", level: "error" }),
    new winston.transports.File({ filename: "log/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
