const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    FirstName: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    LastName: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    Email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    Description: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    Resume: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    Title: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    Links: {
        type: [String],
        trim: true,
        required: true,
        unique: false
    },
    Skills: {
        type: [String],
        trim: true,
        required: true,
        unique: true
    },
    Experience: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    HourlyRate: {
        type: Number,
        trim: true,
        required: true,
        unique: true
    },
    TotalProjects: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    EnglishLevel: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    Availability: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    Bio: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    DetailedDescription: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    Image: {
        type: String,
        trim: true,
        required: true,
        unique: false
    }
});
module.exports = mongoose.model('User', User);