const router = require('express').Router();
const { User, Thought, Reaction } = require('../models')

// GET all users
router.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
  
})

// GET 1 user by _id + thought and friend data

// POST a new user
router.post('/create_user', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.send(newUser);
    } catch (err) {
        res.status(500).send(err)
    }
})

// PUT update a user
router.put('/users/:id', async (req, res) => {
    const updatedUser = await User.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            username: req.body.username,
            email: req.body.email
        },
        {
            // sends updated response back to the client
            new: true
        }
    );
    res.send(updatedUser);
})

// DELETE a user
router.delete('/users/:id', async (req, res) => {
    await User.deleteOne(
        {
            _id: req.params.id
        }
    );
    res.send('User deleted')
})

// GET all thoughts
router.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find();
    res.send(thoughts);
  
})


// GET a single thought by _id



// POST a new thought and push the create thought's _id to the associated user's thoughts array field

module.exports = router