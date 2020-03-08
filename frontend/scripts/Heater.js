export class Heater{
    constructor(heater){
        const{_id,state,name} = heater;
        this._id = _id;
        this.state = state;
        this.name = name;
        this.heaterHandler = this.heaterHandler.bind(this);
        this.deleteItemHandler = this.deleteItemHandler.bind(this);
    }


    deleteItemHandler(){
        let toDeleteItem =  event.target.parentElement;
        toDeleteItem.remove();
        let newdata = {};
        newdata._id = this._id;
        newdata.type = 'Heater';

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

    heaterHandler(){
        let img = event.target;

        if(this.state){
            this.state=false;
            img.src = 'images/greentriangle.png';
        }
        else{
            this.state=true;
            img.src = 'images/redtriangle.png';
        }

        const newdata = {};
            newdata._id = this._id;
            newdata.state=this.state;
            newdata.type = 'Heater';
             const response = fetch( 'http://localhost:4000/togglestate',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(newdata)
             }).then( (something)=>{
             console.log('state toggled');})

    }

    render(){

        let radiator = document.createElement('div');
        radiator.classList.add('radiator');


        let deleteicon = document.createElement('img');
        deleteicon.classList.add('deleteicon');
        radiator.appendChild(deleteicon);
        deleteicon.addEventListener("click", this.deleteItemHandler);

        let triangleicon = document.createElement('img');
        triangleicon.classList.add('triangleicon');
        triangleicon.id = this._id;

        if(this.state){
            triangleicon.src =  'images/redtriangle.png';
        }
        else{
            triangleicon.src = 'images/greentriangle.png';
        }
        radiator.appendChild(triangleicon); 
        triangleicon.addEventListener("click", this.heaterHandler);

        let content = document.createElement('div');
        content.classList.add('content');

        let heaterimg = document.createElement('img');
        heaterimg.classList.add('radiatorimg');
        heaterimg.src = 'images/radiator.png';

        content.appendChild(heaterimg);
        content.append(this.name);

        radiator.appendChild(content);
        return radiator;
    }

}