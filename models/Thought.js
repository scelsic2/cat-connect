const { Schema, model, default: mongoose } = require('mongoose');
const User = require('./User');
const Reaction = require('./Reaction')

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    required: true
  },
  reactions: [{
    type: Schema.Types.ObjectId,
    ref: 'Reaction'
  }]
},{
    timestamps: true,
    toJSON: { virtuals: true },
    id: false
});

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

thoughtSchema.virtual('formattedDate').get(
  function() {
    return this.createdAt.toDateString()
  }
)

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;

