const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
  userTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  userFrom: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Subscribe = mongoose.model('Subscribe', subscriberSchema);

module.exports = { Subscribe };
