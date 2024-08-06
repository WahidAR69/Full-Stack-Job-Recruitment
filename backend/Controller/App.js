const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {Login, Job } = require('../Model/Models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uri = "mongodb+srv://wahidahamd:12345688@cluster0.4adehye.mongodb.net/Job_Recruitment";
// const uri = "mongodb://localhost:27017/"
const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
})

// POST request to create a new user
app.post('/signup', async (req, res) => {
  try {
      const { name, email, password, isEmployer } = req.body;

      // Check if email already exists
      const existingUser = await Login.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'Email already exists, Please Login!' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user in the "users" collection
      const newUser = new Login({ name, email, password: hashedPassword, isEmployer });
      await newUser.save();

      // Create a JWT token
      const token = jwt.sign({ email }, 'random#secret', { expiresIn: '1h' });

      // Send the token in the response
      res.status(201).json({ token, message: 'User registered successfully.' });
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});


  
// POST request to handle login
app.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await Login.findOne({ email });

      // Check if user exists and password is correct
      if (user && await bcrypt.compare(password, user.password)) {
          const token = jwt.sign({ email }, 'random#secret', { expiresIn: '1h' });
          res.json({ token });
      } else {
          res.status(401).json({ error: 'Incorrect email or password' });
      }
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});


// Posting jobs by the employers
app.post('/job-post', async (req, res) => {
    try { 
      const { title, description, requirements, location, apply, userEmail } = req.body;
        
      if (!title || !description || !requirements || !location || !apply ) {
        return res.status(400).send('All fields are required');
      }
  
      const newJob = new Job({ title, description, requirements, location, apply, userEmail });
      await newJob.save()
        .then(() => {
            res.json({ message: 'Job posted successfully' });
        })
        .catch(err => {
          console.log(err);
          res.status(400).send('Error posting job');
        });
    } catch(err) {
      res.status(400).json({ error: err.message });
    }
});


app.post('/job-request', (req, res) => {
    const { search } = req.body;
    const searchRegex = new RegExp(search, 'i');

    Job.find({
        $or: [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { requirements: { $regex: searchRegex } },
            { location: { $regex: searchRegex } },
        ]
    })
    .then(jobs => res.json(jobs))
    .catch(err => res.status(400).json({ error: err.message }));
});

app.post('/update-is-employer', async (req, res) => {
  try {
      const { token, isEmployer } = req.body;

      // Validate isEmployer value
      if (isEmployer !== 'Yes' && isEmployer !== 'No') {
          return res.status(400).send('Invalid value for isEmployer. It must be "Yes" or "No".');
      }

      // Verify and decode the token
      const decoded = jwt.verify(token, 'random#secret');
      const userEmail = decoded.email;

      // Ensure userEmail is present
      if (!userEmail) {
          return res.status(400).send('Email not found in token');
      }

      // Find user by email
      const user = await Login.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Update user's isEmployer field
      user.isEmployer = isEmployer;
      await user.save();

      res.status(200).send('User status updated successfully');
  } catch (err) {
      // Log error for debugging
      console.error('Error updating user status:', err);
      if (!res.headersSent) { // Ensure headers are not already sent
          res.status(400).json({ error: err.message });
      }
  }
});

// GET request to fetch user data
app.get('/user-data', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    const decoded = jwt.verify(token, 'random#secret');
    const userEmail = decoded.email;

    const user = await Login.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({ isEmployer: user.isEmployer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/delete', (req, res) => {
    const { title } = req.body;

    Job.findOneAndDelete({ title: title })
        .then((deletedJob) => {
            if (!deletedJob) {
                return res.status(404).json({ error: 'Job not found' });
            }
            res.json({ message: 'Job deleted successfully' });
        })
        .catch((err) => res.status(400).json({ error: err.message }));
});

