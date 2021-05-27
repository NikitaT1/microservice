import { Worker } from "bullmq";
const { connection, queueName2 } = require("./config");

const htmlWorker = new Worker(queueName2, `${__dirname}/htmlPdfGererator.js`, {
  connection,
});

console.info("Worker listening for jobs");

export default htmlWorker;
