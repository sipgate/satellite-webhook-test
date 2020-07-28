import { GiphyFetch } from "@giphy/js-fetch-api";
import { IncomingWebhook } from "@slack/webhook";
import express from "express";
require("es6-promise").polyfill();
require("isomorphic-fetch");

const port: number = Number(process.env.PORT) || 5000;

const giphyKey = process.env.GIPHY_KEY;
const slackHookUrl = process.env.SLACK_HOOK_URL;
if (!giphyKey) {
  console.error("No giphy key provided");
  process.exit(1);
}
if (!slackHookUrl) {
  console.error("No slack hook url provided");
  process.exit(1);
}

const gf = new GiphyFetch(giphyKey);
const app = express();
const slack = new IncomingWebhook(slackHookUrl);

const terms = ["party", "you rock", "satellite", "applause"];

app.get("/", async (req, res) => {
  res.json("ok");
});

app.post("/", async (req, res) => {
  const term = terms[Math.floor(Math.random() * terms.length)];
  const gifs = await gf.search(term);

  const gif = gifs.data.find(Boolean);
  const url = gif?.images.original.url;

  if (!url) {
    console.error("No gif found", gif);
    res.status(404).json("Not found");
    return;
  }

  console.log("Sending url to slack channel", url);

  // slack.send(url);

  res.json("ok");
});

app.listen(port);
