const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config(); 
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log(err));

const PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    author: String,
    date: { type: Date, default: Date.now }
});
const PostModel = mongoose.model("posts", PostSchema);

app.get('/posts', async (req, res) => {
    try {
        const posts = await PostModel.find().sort({date: -1});
        res.json(posts);
    } catch (err) { res.json(err); }
});

app.post('/create', async (req, res) => {
    try {
        const newPost = await PostModel.create(req.body);
        res.json(newPost);
    } catch (err) { res.json(err); }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        await PostModel.findByIdAndDelete(req.params.id);
        res.json({message: "Deleted"});
    } catch (err) { res.json(err); }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});