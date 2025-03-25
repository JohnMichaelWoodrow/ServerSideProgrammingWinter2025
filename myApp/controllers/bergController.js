const mongoose = require('mongoose');
const Berg = require('../models/bergModel');

const bergSplit = async(req, res) => {
    const { id, bergId } = req.params;
    try{
        const firstBerg = await Berg.updateOne(
            {_id: this._id },
            {$set: {bergId: this.bergId, ...bergData}}
        );
        const secondBerg = await Berg.updateOne(
            {_id: this._id },
            {$set: {bergId: this.bergId, ...bergData}}
        );
     }
    catch (err) {
        res.status(500).json({ message: err.message});
    }
    // After action delete the original
    currentBerg = await Berg.deleteOne({ bergId: String(bergId) }); 
}

module.exports = {
    bergSplit
};
