import React, { Component } from 'react';
import Modal from 'react-modal';
import animalDAO from '../dao/AnimalDAO';
import groupDAO from '../dao/GroupDAO';
import typeDAO from '../dao/TypeDAO';


Modal.setAppElement('#root');
const DAY = 1000 * 60 * 60 * 24;

export default class Animals extends Component {
    constructor(){
        super();
        this.state = {
            // handle opening of modals
            createAnimalModal: false,
            birthModal: false,
            animalInfoModal: false,
            animals: [
                {id:123, gender:'F', udderRank: 5, weights:[], mother: 111, births: 40, desease:'', pregnant:true, comments:'some comment', animalType:'animal type', weaning: 80, herd_num: '555'}
            ],
            groups: [{name: 'group 1', id: 1}, {name: 'group 2', id: 2}],
            types: [],
            newAnimal: {
                iron_num: '', herd_num: '', gov_id: '', gender: 'F', group_id: '', gen_1: '', birth_date: '', animal_type: ''
            },
            selectedAnimal: {}
        }
    }

    componentDidMount(){
        // toDo fetch all sheeps from data base
        animalDAO.getAllAnimals().then(res => {
            console.log(res.data);
            let { animals } = res.data;
            animals = animals.map(animal => {
                const ct = animal.calving_times;
                const fBirth = new Date(ct[0]);
                const lBirth = new Date(ct[ct.length-1]);
                const calc = (lBirth - fBirth)/DAY;
                animal.avgBirthGap = calc ? calc : 0;

                return animal;
            });
            this.setState({animals: animals});
        }).catch(err => {console.error('cannot load animals from server', err)});
        groupDAO.getAllGroups().then(res => {
            this.setState({groups:res.data.groups});
        }).catch(err => {console.error('cannot load groups from server', err)});
        typeDAO.getAllTypes().then(res => {
            this.setState({types:res.data.types});
        }).catch(err => {console.error('cannot load types from server')});
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
        animalDAO.createAnimal(this.state.newAnimal).then(() => {
            console.log('save success');
            this.clearNewAnimal();
        });
        this.setState({createAnimalModal: false});
    }

    openInfoModal = index => {
        console.log('info modal \n index:', index);
        this.setState({animalInfoModal:true, selectedAnimal:this.state.animals[index]});
    }

    closeInfoModal = () => {
        console.log('close info modal');
        this.setState({AnimalInfoModal:false});
    }

    render(){
        const { createAnimalModal, birthModal, animalInfoModal, newAnimal } = this.state;
        const { animals, groups, types, selectedAnimal } = this.state;
        const animalRows = animals.map((animal, index) => <Animal animal={animal} key={animal.id} openInfoModal={() => this.openInfoModal(index)} />)
        return (
            <div className="container-fluid">
                <div className="row flex-xl-nowrap rtl">
                    <SideBar openCreateAnimal={this.openCreateAnimal} />
                    <AnimalsTable>
                        {animalRows}
                    </AnimalsTable>
                    <CreateAnimalModal isOpen={createAnimalModal} onAfterOpen={() => {}} onRequestClose={this.closeCreateAnimalModal} contentLabel="" groups={groups} types={types} save={this.saveAnimal} newAnimal={newAnimal} handleChange={this.handleCreateAnimalChange} />
                    <AnimalInfoModal isOpen={animalInfoModal} onAfterOpen={() => {}} onRequestClose={this.closeInfoModal} contentLabel="" animal={selectedAnimal} />
                </div>
            </div>
        );
    }
}


// subcomponents 
const Animal = props => {
    const { udder, avgBirthGap, _type, herd_num, weaning} = props.animal;
    return (
        <tr>
            <th scope="row">{herd_num}</th>
            <td>{avgBirthGap} ימים</td>
            <td>{udder}</td>
            <td>{weaning}%</td>
            <td>{_type}</td>
            <td>
                <button className="btn btn-secondary" onClick={props.openInfoModal}>+</button>
            </td>
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
                        <th scope="col">פעולות</th>
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
    const { newAnimal, groups, types, handleChange, ...rest } = props; 
    const groupOptions = groups.map(group => <option value={group.id} key={group.id}>{group.name}</option>);
    const typeOptions = types.map(t => <option value={t.id} key={t.id}>{t._type}</option>)
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
                    <InputField inputName="iron_num" inputType="number" value={newAnimal.iron_num} handleChange={handleChange} inputLable="מספר ברזל" />
                    <InputField inputName="herd_num" inputType="number" value={newAnimal.herd_num} handleChange={handleChange} inputLable="מספר עדר" />
                    <InputField inputName="gov_id" inputType="number" value={newAnimal.gov_id} handleChange={handleChange} inputLable="מספר ממשלתי" />
                    <SelectField name="gender" value={newAnimal.gender} handleChange={handleChange} inputLable="מין" >
                        <option value="F">נקבה</option>
                        <option value="M">זכר</option>
                    </SelectField>
                    <SelectField name="group_id" value={newAnimal.group_id} handleChange={handleChange} inputLable="קבוצה" >
                        {groupOptions}
                    </SelectField>
                    <InputField inputName="gen_1" inputType="number" value={newAnimal.gen_1} handleChange={handleChange} inputLable="אמא" />
                    <InputField inputName="birth_date" inputType="date" value={newAnimal.birth_date} handleChange={handleChange} inputLable="תאריך לידה" />
                    <SelectField name="animal_type" value={newAnimal.animal_type} handleChange={handleChange} inputLable="Type" >
                        {typeOptions}
                    </SelectField>
                </div>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-success" onClick={props.save} >שמור</button>
                    <button className="btn btn-danger" onClick={props.onRequestClose} >בטל</button>
                </div>
            </form>
        </Modal>
    );
}

const InputField = props => {
    const { inputName, inputType, value, handleChange, inputLable } = props;
    return (
        <div className="col-4 mb-2">
            <div className="input-group border border-primary rounded"  dir="ltr">
                <input type={inputType} name={inputName} className="form-control" value={value} onChange={handleChange} />
                <div className="input-group-append"><span className="input-group-text rtl">{inputLable}</span></div>
            </div>
        </div>
    );
}

const SelectField = props => {
    const { name, value, handleChange, children, inputLable } = props;
    return (
        <div className="col-4 mb-2">
            <div className="input-group border border-primary rounded"  dir="ltr">
            <select  name={name} className="form-control" value={value} onChange={handleChange}>
                {children}
            </select>
            <div className="input-group-append"><span className="input-group-text">{inputLable}</span></div>
            </div>
        </div>
    );
}

const AnimalInfoModal = props => {
    const { animal, ...rest } = props
    return (
        <Modal isOpen={props.isOpen} 
        onAfterOpen={props.onAfterOpen} 
        onRequestClose={props.onRequestClose}
        contentLabel={props.contentLabel}>
            <div className="jumbotron jumbotron-fluid text-right p-3 rounded">
                <div className="row rtl">
                    <div className="col-3">
                        {animal.gov_id}
                    </div>
                    <div className="col-3">
                        {animal.gov_id}
                    </div>
                </div>
            </div>
        </Modal>
    );
}