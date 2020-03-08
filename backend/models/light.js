const mongoose =  require("mongoose");

const lightSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        state:{
            type:Boolean,
            required:true
        }
});

module.exports = mongoose.model("Light", lightSchema);