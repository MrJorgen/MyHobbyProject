let mongoose = require("mongoose");

let messagesSchema = mongoose.Schema({
   user: String,
   message: String,
   timestamp: {
      type: Date
   }
});

let Message = module.exports = mongoose.model('Message', messagesSchema);