export class Light{

    constructor(light){
        const{_id, state,name} = light;
        this._id = _id;
        this.state =  state;
        this.name = name;
        this.lightHandler = this.lightHandler.bind(this);
        this.deleteItemHandler = this.deleteItemHandler.bind(this);
    }

    deleteItemHandler(){
        let toDeleteItem =  event.target.parentElement;
        toDeleteItem.remove();
        let newdata = {};
        newdata._id = this._id;
        newdata.type = 'Light';

        const response = fetch('http://localhost:4000/deleteitem',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(newdata)
        }).then( (something) => {
            console.log('item deleted');
        })
    }

    lightHandler(){
        let img = event.target;
        if(this.state){
            this.state=false;
            img.src = 'images/lightbulboff.png';
            
        }
        else{
            this.state=true;
            img.src = 'images/lightbulbon.png';
        }

        const newdata = {};
            newdata._id = this._id;
            newdata.state=this.state;
            newdata.type = 'Light';
             const response = fetch( 'http://localhost:4000/togglestate',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(newdata)
             }).then( (something)=>
             {
             console.log('state toggled');
             })
    }

    render(){
        let roomlight = document.createElement('div');
        roomlight.classList.add('roomlight');

        let deleteicon = document.createElement('img');
        deleteicon.classList.add('deleteicon');
        roomlight.appendChild(deleteicon);
        deleteicon.addEventListener("click", this.deleteItemHandler);

        let lightimg =  document.createElement('img');
        lightimg.addEventListener("click", this.lightHandler);
        lightimg.classList.add('bulbimg');
        if(this.state) lightimg.src = 'images/lightbulbon.png';
        else lightimg.src = 'images/lightbulboff.png';

        lightimg.id = this._id;

        roomlight.appendChild(lightimg);
        roomlight.append(this.name);

        return roomlight;
    }

}