const config = require("./config");
const { Queue } = require("bullmq");
import mailWorker from "./mailWorker";
import htmlWorker from "./htmlWorker";
import Redis from "ioredis";
const io = new Redis(); // Connect to 127.0.0.1:6379

io.subscribe("my-channel-1", "my-channel-2", (err, count) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`
    );
  }
});

io.on("message", async (channel, action) => {
  console.log(`Received ${action} from ${channel}`);
  await htmlQueue.add("someTaskName", action);
});

const htmlQueue = new Queue(config.queueName2, {
  connection: config.connection,
});

const mailQueue = new Queue(config.queueName3, {
  connection: config.connection,
});

htmlWorker.on("completed", async () => {
  await mailQueue.add("someTaskName");
});

mailWorker.on("completed", async (job) => {
  io.emit("mailWorker_completed");
});

htmlWorker.on("failed", (job, err) =>
  console.info(`Failed htmlWorker`, job.data, err)
);
mailWorker.on("failed", (job, err) =>
  console.info(`Failed mailWorker`, job.data, err)
);
