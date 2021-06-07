const config = require("./config");
const { Queue } = require("bullmq");
import mailWorker from "./mailWorker";
import htmlWorker from "./htmlWorker";
import Redis from "ioredis";
import htmlPdfGenerator from "./htmlPdfGererator";
const io = new Redis(); // Connect to 127.0.0.1:6379

io.subscribe("createAndSendInvoice", (err, count) => {
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
  await htmlPdfGenerator(action);
});
