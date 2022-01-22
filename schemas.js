const Joi = require("joi");

module.exports.campgroundJoiSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
});

module.exports.reviewJoiSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required(),
  }).required(),
});
