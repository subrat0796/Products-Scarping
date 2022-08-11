const express = require("express");
const axios = require("axios").default;
const cherrio = require("cheerio");
const app = express();
const cors = require("cors")

require('dotenv').config();

var PORT = process.env.PORT || 5000


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  try {
    return res.status(200).json({ message: "Hii welcome to the backend!" });
  } catch (err) {
    console.log(`Error while hitting the home route --------> ${err}`);
    return res.status(500).json({ message: "Some error occured" });
  }
});

app.post("/amazon-product", async (req, res, next) => {
  try {
    const { item } = req.body;
    const urlsearch = item.split(" ").join("+");
    let dataItems = [];
    let nameItems = [];
    let priceItems = [];
    let imageItems = [];
    const host = `https://www.amazon.in/`;
    const url = `${host}s?k=${urlsearch}`;

    const { data } = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "axios 0.21.1",
      },
    });
    // console.log(data);

    var $ = cherrio.load(data);

    var result_obj = [];

    $("a[class='a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal']").each(function () {
      dataItems.push(host + $(this).attr("href"));
    });

    $("span[class='a-size-medium a-color-base a-text-normal']").each(function () {
      nameItems.push($(this).text());
    });

    $("span[class='a-price-whole']").each(function () {
      priceItems.push($(this).text());
    });

    $("img[class='s-image']").each(function () {
      imageItems.push($(this).attr("src"));
    });

    return res.status(200).json({
      message: [
        { dataItems, size: dataItems.length },
        { priceItems, size: priceItems.length },
        { nameItems, size: nameItems.length },
        { imageItems, size: imageItems.length },
      ],
    });
  } catch (err) {
    console.log(`Error while fetching amazon data --------> ${err}`);
    return res.status(500).json({ message: "Some error occured" });
  }
});

app.post("/flipkart-products", async (req, res, next) => {
  try {
    const { item } = req.body;
    const urlSearch = item.split(" ").join("%20");
    const hosturl = `https://flipkart.com/`;
    const url = `${hosturl}search?q=${urlSearch}`;

    const { data } = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "User-agent": "axois 0.21.1",
      },
    });

    var $ = cherrio.load(data);

    var result = [];

    var dataItems = [],
      imageItems = [],
      nameItems = [],
      priceItems = [];

    $("a[class='_1fQZEK']").each(function () {
      dataItems.push(hosturl + $(this).attr("href"));

      // console.log($(this).attr("href"));
    });

    $("img[class='_396cs4 _3exPp9']").each(function () {
      imageItems.push($(this).attr("src"));
      nameItems.push($(this).attr("alt"));
      // console.log($(this).attr("src"));
    });

    $("div[class='_30jeq3 _1_WHN1']").each(function () {
      priceItems.push($(this).text());
    });

    return res.status(200).json({
      message: [
        { dataItems, size: dataItems.length },
        { priceItems, size: priceItems.length },
        { nameItems, size: nameItems.length },
        { imageItems, size: imageItems.length },
      ],
    });
  } catch (err) {
    console.log(`Error while fetching flipkart data ----------> ${err}`);
    return res.status(500).json({ message: "Some error occured" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
