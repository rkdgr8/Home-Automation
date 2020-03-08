import {Light} from './Light.js'
import {Heater} from './Heater.js'

export class Room{
    
    constructor(room){

        const{_id, roomName,items} = room;
        this._id = _id;
        this.roomName = roomName;
        this.deleteRoomHandler = this.deleteRoomHandler.bind(this);
        this.render(items);
    }

    deleteRoomHandler(){
        let deleteroom  = event.target.parentElement.parentElement;
        deleteroom.remove();
        console.log(this);
        const response =  fetch('http://localhost:4000/deleteroom?_id=' + this._id  ,{
            method: 'DELETE',
        }).then( (something)=> {
            console.log('room deleted');
        })
    }

    render(items){

            let flexContainer = document.querySelector('.flex-container');

            let room =  document.createElement('div');
            room.classList.add('room');
            room.id = this._id;
            
            let roomname = document.createElement('div');
            roomname.classList.add('roomname');
            roomname.innerText = this.roomName;

            let addbutton = document.createElement('img');
            addbutton.src = 'images/addbutton.png';
            addbutton.classList.add('addbutton');

            let deleteroom = document.createElement('img');
            deleteroom.src = 'images/deleteroom.png';
            deleteroom.classList.add('deleteroom');


            deleteroom.addEventListener('click', this.deleteRoomHandler);

            roomname.appendChild(addbutton);
            roomname.appendChild(deleteroom);

            room.appendChild(roomname);

            let roomitems = document.createElement('div');
            roomitems.classList.add('roomitems');

            room.appendChild(roomitems);

            for(let item of items){
                
                if(item.type == 'Light'){
                    let lightInstance = new Light(item);
                    let lightDom = lightInstance.render();
                    roomitems.appendChild(lightDom);
                }
                else if(item.type == 'Temperature'){
                    let temperatureInstance = new Temperature(item);
                    let temperatureDom = temperatureInstance.render();
                    roomitems.appendChild(temperatureDom);
                }
                else if(item.type == 'Heater'){
                     let heaterInstance = new Heater(item);
                     let heaterDom =  heaterInstance.render();
                      roomitems.appendChild(heaterDom);
                }

            }
            flexContainer.appendChild(room);

    }
}