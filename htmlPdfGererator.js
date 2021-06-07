import express from "express";
import ejs from "ejs";
import pdf from "html-pdf";
import path from "path";
import { Queue } from "bullmq";
import { queueName } from "./config";
import sendEmail from "./sendEmail";
let app = express();

function htmlPdfGenerator(data) {
  //console.log("props:", props.data);
  ejs.renderFile(
    path.join(__dirname, "./views/", "invoice2.ejs"),
    { data: JSON.parse(data) },
    (err, data) => {
      let options = {
        height: "11.25in",
        width: "8.5in",
        header: {
          height: "20mm",
        },
        footer: {
          height: "20mm",
        },
      };
      pdf.create(data, options).toFile("report.pdf", function (err, data) {
        if (err) {
          console.log(err);
        } else {
          sendEmail();
          console.log("File created successfully");
        }
      });
    }
  );
}

export default htmlPdfGenerator;
