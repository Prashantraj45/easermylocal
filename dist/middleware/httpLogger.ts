import morgan from "morgan";
const logger = require("./logger");

logger.stream = {
  write: (message: any) =>
    logger.info(
      "\n**********************REQUEST_STARTED*********************\n" +
        message.substring(0, message.lastIndexOf("\n"))
    ),
};

export default morgan(
  ":method :url :status :response-time ms - :res[content-length]",
  { stream: logger.stream }
);
