const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

//No specify username and password beacause:
//Will add to our schema username and password field
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
