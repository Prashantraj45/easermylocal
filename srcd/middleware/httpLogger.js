"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const logger = require("./logger");
logger.stream = {
    write: (message) => logger.info("\n**********************REQUEST_STARTED*********************\n" +
        message.substring(0, message.lastIndexOf("\n"))),
};
exports.default = (0, morgan_1.default)(":method :url :status :response-time ms - :res[content-length]", { stream: logger.stream });
