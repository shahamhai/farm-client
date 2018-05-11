import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';


Modal.setAppElement('#root');

export default class Animals extends Component {
    constructor(){
        super();
        this.state = {
            // handle opening of modals
            createAnimalModal: false,
            birthModal: false,
            animalInfoModal: false,
            animals: [
                {id:123, gender:'F', udderRank: 5, weights:[], mother: 111, births: 40, desease:'', pregnant:true, comments:'some comment', animalType:'animal type', weaning: 80, herdId: '555'}
            ],
            groups: [{name: 'group 1', id: 1}, {name: 'group 2', id: 2}],
            newAnimal: {
                herdId: '', govId: '', gender: '', groupId: '', gen1: '', gen2: '', gen3: '', gen4: '', gen5: '', birthDay: '' 
            }
        }
    }

    componentDidMount(){
        // toDo fetch all sheeps from data base
        axios.get('http://159.89.100.98/api/animals').then(res => {
            console.log(res.data);
            this.setState({animals: res.data.animals});
        });
    }

    openCreateAnimal = () => {
        console.log('create animal modal');
        this.setState({createAnimalModal: true});
    }

    handleCreateAnimalChange = e => {
        const { name, value } = e.target;
        const animal = this.state.newAnimal;
        animal[name] = value;
        this.setState({newAnimal: animal});
    }

    clearNewAnimal = () => {
        const { newAnimal } = this.state;
        for( var attr in newAnimal){
            newAnimal[attr] = '';
        }
        this.setState({newAnimal: newAnimal});
    }

    closeCreateAnimalModal = () => {
        console.log('close animal modal');
        this.setState({createAnimalModal: false});
    }

    saveAnimal = e => {
        e.preventDefault();
        console.log('sending put request to server. animal: ', this.state.animal);
        axios.put('http://159.89.100.98/api/animal', this.state.newAnimal).then(() => {
            console.log('save success');
            this.clearNewAnimal();
        });
        this.setState({createAnimalModal: false});
    }

    render(){
        const { createAnimalModal, birthModal, animalInfoModal, newAnimal } = this.state;
        const { animals, groups } = this.state;
        const animalRows = animals.map(animal => <Animal animal={animal} key={animal.id} />)
        return (
            <div className="container-fluid">
                <div className="row flex-xl-nowrap rtl">
                    <SideBar openCreateAnimal={this.openCreateAnimal} />
                    <AnimalsTable>
                        {animalRows}
                    </AnimalsTable>
                    <CreateAnimalModal isOpen={createAnimalModal} onAfterOpen="" onRequestClose={this.closeCreateAnimalModal} contentLabel="" groups={groups} save={this.saveAnimal} newAnimal={newAnimal} handleChange={this.handleCreateAnimalChange} />
                </div>
            </div>
        );
    }
}


// subcomponents 
const Animal = props => {
    const { id, gender, udderRank, weights, mother, births, desease, pregnant, comments, animalType, herdId, weaning} = props.animal;
    return (
        <tr>
            <th scope="row">{herdId}</th>
            <td>{births} ימים</td>
            <td>{udderRank}</td>
            <td>{weaning}%</td>
            <td>{animalType}</td>
        </tr>
    );
}
const AnimalsTable = props => {
    return (
        <div className="col-10 p-0">
            <table className="table table-dark table-striped table-hover rtl col-10" >
                <thead className="thead-light">
                    <tr>
                        <th scope="col">מספר עדר</th>
                        <th scope="col">מרווח בין המלטות</th>
                        <th scope="col">דירוג עטין אחרון</th>
                        <th scope="col">אחוז גמילה ממשי</th>
                        <th scope="col">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {props.children}
                </tbody>
            </table>
        </div>
    );
}

const SideBar = props => {
    return (
        <nav className="nav col-2 flex-column border border-primary rounded p-0 mh-100">
            <div className="card bg-success">
                <div className="card-body">
                    <button className="btn" onClick={props.openCreateAnimal}>הוסף כבשה חדשה</button>
                </div>
            </div>
            <div className="card bg-success">
                <div className="card-header bg-primary">סידור</div>
                <div className="card-body rtl">

                    <select></select>
                </div>
            </div>
            <div className="card bg-success">
                <div className="card-header bg-primary">סינון</div>
                <div className="card-body">
                    <div className="input-group mb-3" dir="ltr">
                        <select className="custom-select" dir="rtl">
                            <option value=""></option>
                        </select>
                        <div className="input-group-append">
                            <span className="input-group-text">הוסף כלל</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Modals
const CreateAnimalModal = props => {
    const { newAnimal, groups, handleChange } = props; 
    const groupOptions = groups.map(group => <option value={group.id} key={group.id}>{group.name}</option>);
    return (
        <Modal 
        isOpen={props.isOpen} 
        onAfterOpen={props.onAfterOpen} 
        onRequestClose={props.onRequestClose}
        contentLabel={props.contentLabel}
        >
            <form className="jumbotron jumbotron-fluid text-right p-3">
                <h4 >הוסף כבשה חדשה לעדר</h4>
                <div className="row rtl">
                    <div className="col-4 mb-2">
                        <div className="input-group border border-primary rounded" dir="ltr">
                            <input name="herdId" type="number" className="form-control" value={newAnimal.herdId} onChange={handleChange} />
                            <div className="input-group-append"><span className="input-group-text">מספר עדר</span></div>
                        </div>
                    </div>
                    <div className="col-4 mb-2">
                        <div className="input-group border border-primary rounded" dir="ltr">
                            <input name="govId" type="number" className="form-control" value={newAnimal.govId} onChange={handleChange} />
                            <div className="input-group-append"><span className="input-group-text">מספר ממשלתי</span></div>
                        </div>
                    </div>
                    <div className="col-4 mb-2">
                        <div className="input-group border border-primary rounded" dir="ltr">
                            <select  name="gender" className="form-control" value={newAnimal.gender} onChange={handleChange}>
                                <option value="F">נקבה</option>
                                <option value="M">זכר</option>
                            </select>
                            <div className="input-group-append"><span className="input-group-text">מין</span></div>
                        </div>
                    </div>
                    <div className="col-4 mb-2">
                        <div className="input-group border border-primary rounded" dir="ltr">
                            <select name="groupId" className="form-control" value={newAnimal.groupId} onChange={handleChange}>
                                {groupOptions}
                            </select>
                            <div className="input-group-append"><span className="input-group-text">קבוצה</span></div>
                        </div>
                    </div>
                    <div className="col-4 mb-2">
                        <div className="input-group border border-primary rounded" dir="ltr">
                            <input  name="gen1" type="text" className="form-control" value={newAnimal.gen1} onChange={handleChange}/>
                            <div className="input-group-append"><span className="input-group-text">אמא</span></div>
                        </div>
                    </div>
                    <div className="col-4 mb-2">
                        <div className="input-group border border-primary rounded" dir="ltr">
                            <input name="gen2" type="text" className="form-control" value={newAnimal.gen2} onChange={handleChange}/>
                            <div className="input-group-append"><span className="input-group-text">סבתא</span></div>
                        </div>
                    </div>
                    <div className="col-4 mb-2">
                        <div className="input-group border border-primary rounded" dir="ltr">
                            <input name="gen3" type="text" className="form-control" value={newAnimal.gen3} onChange={handleChange}/>
                            <div className="input-group-append"><span className="input-group-text rtl">3 דורות אחורה</span></div>
                        </div>
                    </div>
                    <div className="col-4 mb-2">
                        <div className="input-group border border-primary rounded" dir="ltr">
                            <input name="gen4" type="text" className="form-control" value={newAnimal.gen4} onChange={handleChange}/>
                            <div className="input-group-append"><span className="input-group-text rtl">4 דורות אחורה</span></div>
                        </div>
                    </div>
                    <div className="col-4 mb-2">
                        <div className="input-group border border-primary rounded" dir="ltr">
                            <input name="gen5" type="text" className="form-control" value={newAnimal.gen5} onChange={handleChange}/>
                            <div className="input-group-append"><span className="input-group-text rtl">5 דורות אחורה</span></div>
                        </div>
                    </div>
                    <div className="col-4 mb-2">
                        <div className="input-group border border-primary rounded" dir="ltr">
                            <input name="birthDay" type="date" className="form-control" value={newAnimal.birthDay} onChange={handleChange}/>
                            <div className="input-group-append"><span className="input-group-text rtl">תאריך לידה</span></div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-success" onClick={props.save} >שמור</button>
                    <button className="btn btn-danger" onClick={props.onRequestClose} >בטל</button>
                </div>
            </form>
        </Modal>
    );
}

const birthModal = props => {
    return (
        <Modal>
            this is the birth Modal
        </Modal>
    );
}