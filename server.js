const config = require("./config");
const { Queue } = require("bullmq");
const mailWorker = require("./mailWorker");
const htmlWorker = require("./htmlWorker");
const Redis = require("ioredis");
const io = new Redis(); // Connect to 127.0.0.1:6379

io.subscribe("my-channel-1", "my-channel-2", (err, count) => {
  if (err) {
    // Just like other commands, subscribe() can fail for some reasons,
    // ex network issues.
    console.error("Failed to subscribe: %s", err.message);
  } else {
    // `count` represents the number of channels this client are currently subscribed to.
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`
    );
  }
});

io.on("message", async (channel, action) => {
  console.log(`Received ${action} from ${channel}`);
  await htmlQueue.add("someTaskName", action);
});

//const nodeIP = process.env.NODE_IP || "localhost";

const htmlQueue = new Queue(config.queueName2, {
  connection: config.connection,
});

const mailQueue = new Queue(config.queueName3, {
  connection: config.connection,
});

htmlWorker.on("completed", async () => {
  console.log("htmlWorker ============> completed");
  console.info(`Completed htmlWorker`);
  await mailQueue.add("someTaskName");
});

mailWorker.on("completed", async (job) => {
  console.info(`Completed mailWorker`, job.name);
  io.emit("mailWorker_completed");
});

htmlWorker.on("failed", (job, err) =>
  console.info(`Failed htmlWorker`, job.data, err)
);
mailWorker.on("failed", (job, err) =>
  console.info(`Failed mailWorker`, job.data, err)
);
