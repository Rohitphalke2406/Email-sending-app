require('dotenv').config();
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the static files from the public directory
app.use(express.static(path.join(__dirname, "files")));

// Serve the index.html file at the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "files", "index.html"));
});

app.post("/send-email", (req, res) => {
  const { from, to, subject, message } = req.body;

  // Basic validation
  if (!from || !to || !subject || !message) {
    return res.status(400).send("All fields are required.");
  }

  console.log('Sending email from:', from);
  console.log('Sending email to:', to);
  console.log('Email subject:', subject);
  console.log('Email message:', message);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // Enable detailed logging
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("Nodemailer verification failed:", error);
    } else {
      console.log("Nodemailer is ready to send emails");
    }
  });

  const mailOptions = {
    from,
    to,
    subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Email could not be sent.");
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).send("Email sent successfully!");
    }
  });
});

// Initializing web server
app.listen(port, () => console.log(`Server is running at port ${port}`));
