const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the USER collection
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        default: '123'
    },
    email: {
        type: String,
        required: true
    },
    colorWeaknesses: [{
        background_color: {
            type: String,
            required: true
        },
        font_color: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }],
    sizeWeaknesses: [{
        fontSize: {
            type: Number,
            required: true
        },
        distance: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }],
    fieldWeaknesses: [{
        side: {
            type: String,
            enum: ['right', 'left'],
            required: true
        },
        distance: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }]

});

export const User = mongoose.models?.User || mongoose.model('User', userSchema);

