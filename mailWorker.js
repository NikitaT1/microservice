import { Worker } from "bullmq";
const { connection, queueName3 } = require("./config");

const mailWorker = new Worker(queueName3, `${__dirname}/sendEmail.js`, {
  connection,
});

console.info("Worker listening for jobs");

export default mailWorker;
