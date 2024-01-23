const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb'); // Import MongoClient from mongodb
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to the database
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true
});
mongoose.set('strictQuery', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
const client = new MongoClient(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get doctors API endpoint
app.get('/api/doctors', async (req, res) => {
  try {
    await client.connect();

    const db = client.db('Healthcare'); // Replace with your database name
    const doctorsCollection = db.collection('doctors'); // Replace with your collection name

    const doctors = await doctorsCollection.find().toArray();
    res.status(200).json({
      status: 'Success',
      data: {
        list: doctors,
      },
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.close();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
