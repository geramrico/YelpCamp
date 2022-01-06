// Packages imports
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const cities = require("./cities.js");
const { places, descriptors } = require("./seedHelpers.js");

// Model imports
const Campground = require("../models/campground");

// Connect Mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
  console.log("Database connected!");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Create data to work with
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
});
