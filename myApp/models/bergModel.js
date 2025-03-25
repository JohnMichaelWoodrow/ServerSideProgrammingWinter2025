const mongoose = require('mongoose');

const BergSchema = new mongoose.Schema({
    mission: {
        type: String,
        required: [true, "Mission is required"],
        unique: true 
    },
    aircraft: {
        type: String,
        required: [true, "Aircraft is required"]
    },
    latitude: {
        type: Double,
        required: [true, "Latitude is required"]
    },
    longitude: {
        type: Double,
        required: [true, "Longitude is required"]
    },
    bergId: {
        type: String,
        required: [true, "BergID is required"] 
    },
    iceType: {
        type: String,
        default: 'Tabular'  
    },
    iceSize: {
        type: Number  
    },
    seaState: {
        type: String,
        default: 'Calm'  
    },
    seaTemp: {
        type: Double  
    },
    iceGrounded: {
        type: Boolean,
        default: 'false'  
    },
    comment: {
        type: String  
    },
     
    timestamps: true
});

module.exports = mongoose.model('Berg', BergSchema, 'berg');