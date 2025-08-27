const express = require("express");
const webpush = require("web-push");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const publicVapidKey = process.env.VAPID_PUBLIC;
const privateVapidKey = process.env.VAPID_PRIVATE;

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  publicVapidKey,
  privateVapidKey
);

let subscriptions = [];

// subscribe route
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// send notification
app.get("/sendNotification", (req, res) => {
  const payloads = [
    "Stay strong, Yemisi! 💪",
    "Remember your goals 🌸",
    "Replace old habits with growth 🌱",
    "Discipline today = freedom tomorrow ✨",
    "Small steps, big results 🚀"
  ];
  const randomMessage =
    payloads[Math.floor(Math.random() * payloads.length)];

  subscriptions.forEach((sub, i) => {
    webpush
      .sendNotification(sub, JSON.stringify({ title: "Habit Coach", body: randomMessage }))
      .catch(err => {
        console.error("Error sending notification", err);
        subscriptions.splice(i, 1);
      });
  });

  res.json({ success: true, message: randomMessage });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
