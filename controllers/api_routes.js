const router = require('express').Router();
const { User, Thought, Reaction } = require('../models')

// GET all users
router.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
  
})

// GET 1 user by _id + thought and friend data
router.get('/users/:id', async (req, res) => {
    const user = await User.findOne({
        _id: req.params.id
    }).populate('thoughts')
    .populate('friends');
    res.send(user)
})

// POST a new user
router.post('/users', async (req, res) => {
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
    res.send('User deleted!')
})

// /api/users/:userId/friends/:friendId

// POST to add a new friend to a user's friend list
router.post('/users/:userId/friends/:friendId',   async (req, res) => {
    const { userId, friendId } = req.params;
    User.findOneAndUpdate(
        { _id: userId },
        { $push: { friends: friendId } },
        { new: true }
    )
    .then((user) => {
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            res.json({ message: 'Friend added.' });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    });
});

// DELETE to remove a friend from a user's friend list
router.put('/users/:userId/friends/:friendId',   async (req, res) => {
    const { userId, friendId } = req.params;
    User.findOneAndUpdate(
        { _id: userId },
        { $pull: { friends: friendId } },
        { new: true }
    )
    .then((user) => {
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            res.json({ message: 'Friend removed.' });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    });
});

// GET all thoughts
router.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find().populate('reactions');
    res.send(thoughts);
  
})

// GET a single thought by _id
router.get('/thoughts/:id', async (req, res) => {
    const thought = await Thought.findOne({
        _id: req.params.id
    }).populate('reactions');
    res.send(thought)
})

// POST a new thought and push the create thought's _id to the associated user's thoughts array field
// module 18, activity 21
router.post('/thoughts', (req, res) => {
    const newThought = Thought.create(req.body)
    .then((thought) => {
        return User.findOneAndUpdate(
            { username: req.body.username },
            { $push: { thoughts: thought._id} },
            {new: true }
        );
    }).then((user => {
        !user
            ? res
                .status(404)
                .json({message: 'Thought created, but no Users with this name.'})
            : res.json({message: 'Thought created.'})

            // if(user === false) {
            //     res
            //     .status(404)
            //     .json({message: 'Thought created, but no Users with this name.'})
            // }
            // else {
            //     res.json({message: 'Thought created.'})
            // }
    })).catch((err) => {
        console.error(err)
    })
})

// PUT update a thought by ID
router.put('/thoughts/:id', async (req, res) => {
    const updatedThought = await Thought.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            thoughtText: req.body.thoughtText,
        },
        {

            new: true
        }
    );
    res.send(updatedThought);
})

// DELETE one thought by ID
router.delete('/thoughts/:id', async (req, res) => {
    await Thought.deleteOne(
        {
            _id: req.params.id
        }
    );
    res.send('Thought deleted!')
})

// /api/thoughts/:thoughtId/reactions

// POST to create a reaction stored in a single thought's reactions array field
router.post('/thoughts/:thoughtId/reactions', (req, res) => {
    const newReaction = Reaction.create(req.body)
    .then((reaction) => {
        return Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: reaction._id} },
            {new: true }
        );
    }).then((reaction => {
        !reaction
            ? res
                .status(404)
                .json({message: 'Reaction created, but no Thoughts with this ID.'})
            : res.json({message: 'Reaction created.'})
    })).catch((err) => {
        console.error(err)
    })
})

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
    await Reaction.deleteOne(
        {
            _id: req.params.reactionId
        }
    );
    res.send('Reaction deleted!')
})

// GET all reactions?
// router.get('/reactions', async (req, res) => {
//     const reactions = await Reaction.find();
//     res.send(reactions);
  
// })

module.exports = router