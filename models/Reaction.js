const { Schema, model, default: mongoose } = require('mongoose');
const User = require('./User')
const Thought = require('./Thought');

const reactionSchema = new Schema({
  reactionId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  reactionBody: {
    type: String,
    required: true,
    maxLength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},{
    timestamps: true,
});

const Reaction = model('Reaction', reactionSchema);

module.exports = Reaction;

