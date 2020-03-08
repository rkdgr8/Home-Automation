import {Room} from './Room.js'

let Rooms=[];
getAllRooms();

// let roomobj={
//     _id:'1212ljjkl',
//     roomName: 'Master bedroom',
//     items: [ {_id:1, state:false, type:'Light', name:'Tube Light'},
//              {_id:2, state:false, type:'Light', name:'Night lamp'},
//              {_id:3 , state:false , type:'Light', name:'Study Light'},
//             {_id:4, state:false, type:'Heater', name:'Heater'} ] 
// }


// const newroom = new Room(roomobj);

// function deleteItem(){
//     console.log('deleting item')
//     let deleteicon = event.target;
//     let toDeleteItem = event.target.parentElement;
//     toDeleteItem.remove();
// }
function openRoomForm(){
    
    document.getElementById("modalcontainer").style.display="block";
}

function closeRoomForm(){
    
    document.getElementById("modalcontainer").style.display="none";
    
}

async function getAllRooms(){

    const response = await fetch( 'http://localhost:4000/getallrooms', {
        method:'GET'
    });
    let allrooms = await response.json();
    console.log(allrooms);

    for(let room of allrooms){
        let newroom = new Room(room);
        Rooms.push(newroom);
    }
}
function numberInputHandler(){
    
    let numberInput = event.target;
    
    let noofitems = parseInt(numberInput.value);
    // console.log(noofitems);
    
    let flexformitem = numberInput.parentElement.parentElement;
    let itemstates = flexformitem.querySelectorAll('.itemstate');
    itemstates.forEach((item)=> item.remove());

    

    for(let i=0;i<noofitems;i++)
    {
        let newitemstate = document.createElement('div');
        newitemstate.classList.add('itemstate');
        newitemstate.innerHTML= '<input type="text" placeholder="Enter item name" required><label for="on">ON</label><input type="checkbox" name="on"> ';
        flexformitem.appendChild(newitemstate);
    }
}

function addRoom(e){
    e.preventDefault();
    let newroom = {}

    let roomname = document.getElementById('nameofroom').value;
    let  lights= [];
    let heaters = [];

    let domlights = document.querySelectorAll('.addlights .itemstate');
    domlights.forEach( (domlight)=>{
        let newlight = {};
        newlight.name = domlight.querySelector('input[type=text]').value;
        newlight.state  = domlight.querySelector('input[type=checkbox]').checked;
        lights.push(newlight);
    })

    let domheaters =  document.querySelectorAll('.addheaters .itemstate');
    domheaters.forEach((domheater)=> {
        let newheater={};
        newheater.name = domheater.querySelector('input[type=text]').value;
        newheater.state  = domheater.querySelector('input[type=checkbox]').checked;
        heaters.push(newheater);
    })
    
    newroom.roomName = roomname;
    newroom.lights = lights;
    newroom.heaters = heaters;

   postnewroom('http://localhost:4000/addroom', newroom).then( (room)=>{
       let nroom = new Room(room);
       Rooms.push(nroom);
   })
    closeRoomForm();
}

async function postnewroom(url='',data={})
{
    const response = await fetch( url, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
    });
    return await response.json();
}

let form = document.querySelector('.form-container');
form.addEventListener("submit", addRoom);

let addroombtn = document.querySelector('.add-room');
addroombtn.addEventListener("click",openRoomForm);

let cancel= document.querySelector('.cancel');
cancel.addEventListener("click", closeRoomForm);

window.addEventListener("click", (e)=>{
    if(e.target === document.getElementById('modalcontainer'))
        document.getElementById('modalcontainer').style.display = "none";
})

let numberInputs = document.querySelectorAll('.flex-form input[type=number]');

numberInputs.forEach((numberinput)=> {
    numberinput.addEventListener("change", numberInputHandler)
})