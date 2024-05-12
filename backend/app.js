const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Post = require('./models/post.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


app.use(cors({
    origin: 'http://localhost:4200' 
}));

//mongodb connection
mongoose.connect("mongodb+srv://arvingm1522:NWhBOmNTzDJ3Xq72@dcodehub.ajwn4fs.mongodb.net/dcodehub?retryWrites=true&w=majority&appName=dcodehub")
.then(() => {
    console.log('Connected to the database');
})
.catch(() => {
    console.log('connection failed');
});

//parsing of JSON 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, x-Requested-with, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

//JsonWebToken secret key
const jwtSecretKey = process.env.JWT_SECRET_KEY;

//API para ma verify ang JsonWebToken
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
       return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
   
    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer token"
    if (!token) {
       return res.status(401).json({ message: 'Invalid token format.' });
    }
   
    try {
       const decoded = jwt.verify(token, jwtSecretKey);
       req.user = decoded;
       next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ message: 'Invalid token.' });
    }
    
};


// User model and routes
const UserSchema = new mongoose.Schema({
    username: {
       type: String,
       required: true,
       unique: true
    },
    password: {
       type: String,
       required: true
    }
   });
   
   UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
       this.password = await bcrypt.hash(this.password, 10);
    }
    next();
   });
   
   UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
   };
   

// Declare User model only once
const User = mongoose.model('User', UserSchema);

// Registration route
app.post('/register', async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password // Make sure to hash the password before saving
        });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
      console.log("Login attempt:", req.body); // Log the incoming request body
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        console.log("User not found"); // Log when user is not found
        return res.status(400).json({ message: 'User not found' });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log("Invalid password"); // Log when password is invalid
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      console.log("Generating token for user:", user); // Log before generating the token
      const token = jwt.sign({ id: user._id, username: user.username }, jwtSecretKey, { expiresIn: '30m' });
      console.log("Token generated:", token); // Log the generated token
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error); // Log any other errors
      res.status(500).json({ message: error.message });
    }
  });

// para sa post model and routes
app.post("/api/posts", (req, res, next) => {
    console.log(req.body);
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl
    });

    post.save()
    .then(savedPost => {
        console.log(savedPost);
        res.status(201).json({
            message: 'post added successfully'
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message: 'Error saving post'
        });
    });
});
// post delete
app.delete('/api/posts/:_id', async (req, res) => {
    console.log('Attempting to delete post with ID:', req.params._id);
    try {
       const post = await Post.findByIdAndDelete(req.params._id);
       if (!post) {
         console.log('Post not found');
         return res.status(404).json({ message: 'Post not found' });
       }
       console.log('Post deleted successfully');
       res.json({ message: 'Post deleted successfully' });
    } catch (error) {
       console.error('Server error:', error);
       res.status(500).json({ message: 'Server error' });
    }
});

// route para ma fetch ang mga posts
app.get('/api/posts', (req, res) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: documents
        });
    });
});

app.put('/api/posts/:_id', (req, res, next) => {
    const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl // Ensure imageUrl is updated if needed
    };

    //update post
    Post.updateOne({ _id: req.params._id }, { $set: post }, { new: true })
        .then(result => {
            if (result.nModified === 0) {
                // No documents were updated
                return res.status(404).json({ message: 'Post not found' });
            }
            res.status(200).json({ message: 'Post updated successfully', post: result });
        })
        .catch(err => {
            console.error('Error updating post:', err);
            res.status(500).json({ message: 'Error updating post', error: err });
        });
});



module.exports = app;