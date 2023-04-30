const { Schema, model, default: mongoose } = require('mongoose');
const Thought = require('./Thought');
const Reaction = require('./Reaction')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trimmed: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/ , 'Invalid email format']
  },
  thoughts: [{
    type: Schema.Types.ObjectId,
    ref: 'Thought'
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
},{
    // virtuals will be included when converting the document to JSON
    // _id's will not be included in the JSON
    toJSON: { virtuals: true },
    id: false
});

// when you access the friendCount property, mongoose will compute the length of the friends array field for that document and return it as the value of the virtual
userSchema.virtual('friendCount').get(
  function() {
    return this.friends.length;
})

const User = model('User', userSchema);

// const user = await User.findById(userId);
// console.log(user.friendCount);

module.exports = User;

