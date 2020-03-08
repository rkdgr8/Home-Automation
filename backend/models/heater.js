const mongoose =  require("mongoose");

const heaterSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        state:{
            type:Boolean,
            required:true
        }
});

module.exports = mongoose.model("Heater", heaterSchema);