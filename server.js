const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Replace with your MongoDB Atlas connection string
const uri = 'mongodb+srv://andrewseo:TERIseo135*@cluster0.rqqfiqc.mongodb.net/initialGraphAttemptData?retryWrites=true&w=majority';



// Enable Mongoose debugging
mongoose.set('debug', true);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const ratingSchema = new mongoose.Schema({
    nodeId: { type: String, required: true },
    rating: { type: Number, required: true }
}, { collection: 'ratings' });

const Rating = mongoose.model('Rating', ratingSchema);

app.post('/api/rating', async (req, res) => {
    const { nodeId, rating } = req.body;
    console.log('Received request:', req.body);
    try {
        const existingRating = await Rating.findOne({ nodeId });
        if (existingRating) {
            console.log('Updating existing rating');
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            console.log('Creating new rating');
            const newRating = new Rating({ nodeId, rating });
            await newRating.save();
        }
        res.status(200).json({ message: 'Rating saved successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to save rating' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});