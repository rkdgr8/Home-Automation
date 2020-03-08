const mongoose =  require("mongoose");

const roomSchema  = new mongoose.Schema({
   name:{
       type:String,
       required:true
   },
    items:[
        {
            id:{
                type:String,
                required:true
            },
            type:{
                type:String,
                required:true
            }
        }
    ]
})

module.exports = mongoose.model("Room", roomSchema);