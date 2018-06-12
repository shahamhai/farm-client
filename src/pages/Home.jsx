import React, { Component } from 'react';
import axios from 'axios';

export default class Home extends Component {
    constructor(){
        super();
        this.state = {
            vaccine1: [
                {id:123, race:'sheep race', udderRank: 5, weights:[], mother: 111, births: 40, desease:'', pregnant:true, comments:'some comment', animalType:'animal type', weaning: 80, herdId: '555'},
                {id:124, race:'sheep race', udderRank: 5, weights:[], mother: 111, births: 40, desease:'', pregnant:true, comments:'some comment', animalType:'animal type', weaning: 80, herdId: '555'}
            ],
            vaccine2: [],
            birthGap: [],
            newGroup: ''
        };
    }

    handleChange = e => {
        this.setState({newGroup: e.target.value});
    }

    createNewGroup = e => {
        e.preventDefault();
        const group = {name: this.state.newGroup};
        axios.put('http://159.89.100.98/api/groups', group).then(res => {
            console.log('created a new group');
        });
    }

    componentDidMount(){
        // toDo fetch herd warnings from server here 

    }
    async fetchData(){
        try {
            const unvaccined_1 = await axios.get('');
            const unvaccined_2 = await axios.get('');
            const births = await axios.get('');
            const deaths = await axios.get('');
            this.setState({unvaccined_1, unvaccined_2, births, deaths});
        } catch (err) {
            
        }
    }
    render() {
        const { vaccine1, vaccine2, birthGap, newGroup} = this.state;
        return (
            <div className="row rtl">
                <Vaccine title="חיסון 1" animals={vaccine1} />
                <Vaccine title="חיסון 2" animals={vaccine2} />
                <BirthGap title="מרווח חריג בין המלטות" />
                <Groups title="קבוצות" newGroup={newGroup} change={this.handleChange} submit={this.createNewGroup} />
            </div>
        );
    }
}

const Vaccine = props => {
    const { title ,animals } = props;
    const bgColor = animals && animals.length ? 'bg-warning' : 'bg-success';
    const animalList = animals && animals.length ? 
        animals.map(animal => <div key={animal.id} className="col-2 mx-1">{animal.herdId}</div>) :
        <p>אין טליים שצריכים חיסון</p> ;
    return (
        <div className={`card col-4 `+ bgColor}>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <div className="row">
                    {animalList}
                </div>
            </div>
        </div>
    );
}

const BirthGap = props => {
    const { title, animals } = props;

    return (
        <div className="card col-4">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
            </div>
        </div>
    );
}

const Groups = props => {
    const { title, newGroup, change, submit } = props;
    return (
        <div className="card col-4">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <form className="input-group mb-3" dir="ltr">

                    <input type="text" value={newGroup} onChange={change} className="form-control" />
                    <button onClick={submit} className="input-group-append" >צור קבוצה חדשה</button>
                </form>
            </div>
        </div>
    );
}