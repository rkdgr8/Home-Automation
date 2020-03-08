const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 4000;
const dbUrl = 'mongodb://127.0.0.1:27017/HA';
const path = require('path');
const frontendDirectoryPath = path.join(__dirname, '../frontend');
const Room = require('./models/room.js');
const Light = require('./models/light.js');
const  Heater = require('./models/heater.js');


const app = express();

app.use(express.static(frontendDirectoryPath));
app.use(cors());
app.use(express.json());  // Parsing requests as in JSON format

mongoose.connect(dbUrl,{useNewUrlParser:true, useUnifiedTopology: true });
mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);

const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB Error: '));
conn.on('connected', () => {
  console.log('Connected To Database...');
});

app.delete('/deleteroom', async (req,res)=>{
  const roomid = req.query._id;
  const room = await Room.findById({_id:roomid});

  for(let item of room.items){
      if(item.type == 'Light'){
        const light = await Light.deleteOne({_id:item.id});
      }
      else if(item.type == 'Heater'){
        const heater = await Heater.deleteOne({_id:item.id});
      }
  }

  Room.deleteOne({_id:roomid}).then( (something)=>{
    res.status(200).send('room deleted');
  })
  
})

app.post('/deleteitem', async function(req,res){
  const item = req.body;
  if(item.type == 'Light'){
    Light.deleteOne( {_id: item._id}).then( (something)=> {
      res.status(200).send('Successfully deleted light');
    })
  }
  else if(item.type == 'Heater'){
    Heater.deleteOne( {_id:item._id}).then ( (something)=> {
      res.status(200).send('Successfully deleted heater');
    })
  }
})



app.post('/togglestate', async function (req,res){

const item = req.body;
console.log('toggling state');

if(item.type == 'Light'){
  Light.findByIdAndUpdate( item._id , {state:item.state}).then( (light)=>
  {console.log(light);
    res.send(light);
  }).catch((err)=>{
    console.log(errr);
  })
}
else if(item.type == 'Heater'){

  Heater.findByIdAndUpdate( item._id , {state:item.state}).then( (heater)=>
  {console.log(heater);
    res.send(heater);
  }).catch((err)=>{
    console.log(errr);
  })

}

})

app.get( '/getallrooms' , async function(req,res){

  var Rooms = [];

  try{
    var rooms = await Room.find();
  }
  catch(e){
  }

 // console.log(rooms);

  for(let room of rooms){
      var newroom={};
      newroom._id = room._id;
      newroom.roomName = room.name;
      newroom.items = [];

      for(let item of room.items){

          if(item.type == 'Light'){
              try{
                let lightitem = await Light.findById(item.id);
                let newroomitem={};
                newroomitem._id = lightitem._id;
                newroomitem.type = 'Light';
                newroomitem.name = lightitem.name;
                newroomitem.state = lightitem.state;
                newroom.items.push(newroomitem);
              }
              catch(e){

              }
          }
          else if(item.type == 'Heater'){
              try{
                let heateritem =  await Heater.findById(item.id);
                let newroomitem={};
                newroomitem._id = heateritem._id;
                newroomitem.type = 'Heater';
                newroomitem.name = heateritem.name;
                newroomitem.state = heateritem.state;
                newroom.items.push(newroomitem);
                
              }
              catch(e){

              }
          }

      }
      Rooms.push(newroom);
  }

  console.log(Rooms);
  res.send(Rooms);

})


app.post( '/addroom', async function (req,res) {
  let roomobj = req.body;
  // console.log(roomobj);
  let toreturnobj = {};
  toreturnobj.roomName = roomobj.roomName;
  toreturnobj.items = [];

  let newroom = {};
  newroom.name = roomobj.roomName;
  newroom.items = [];

  for(let i=0;i<roomobj.lights.length;i++){

      try {
      let response = await Light.create(roomobj.lights[i]);
    //  console.log(response);
        newroom.items.push({id:response._id,type:'Light'});
        let newitem = {};
        newitem._id = response._id;
        newitem.type = 'Light';
        newitem.name = response.name;
        newitem.state = response.state;
       // console.log(newitem);
        toreturnobj.items.push(newitem);
      }catch(e){
        console.log(e);
      }
  

  }

  for(let i=0;i<roomobj.heaters.length;i++){
        try{
        let response = await Heater.create(roomobj.heaters[i]);
       // console.log(response);
        newroom.items.push({id:response._id,type:'Heater'});
        let newitem = {};
        newitem._id = response._id;
        newitem.type = 'Heater';
        newitem.name = response.name;
        newitem.state = response.state;
       // console.log(newitem);
        toreturnobj.items.push(newitem);
        }catch(e){
          console.log(e);
        }
  }
  
    try{
      let response = await Room.create(newroom);
      roomobj._id = response._id;
      toreturnobj._id = response._id;
    }catch(e){
      console.log(e);
    }


 
    // console.log(toreturnobj);
 
 res.send(toreturnobj);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))