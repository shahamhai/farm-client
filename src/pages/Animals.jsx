import React, { Component } from 'react';
import Modal from 'react-modal';
import animalDAO from '../dao/AnimalDAO';
import groupDAO from '../dao/GroupDAO';
import typeDAO from '../dao/TypeDAO';
import moment from 'moment'
import ComponentSwitch from '../reusableComonents/ComponentSwitch';


Modal.setAppElement('#root');
const DAY = 1000 * 60 * 60 * 24;
const YEAR = DAY * 365;

export default class Animals extends Component {
    constructor(){
        super();
        this.state = {
            // handle opening of modals
            createAnimalModal: false,
            animalInfoModal: false,
            animals: [
                {id:123, gender:'F', udderRank: 5, weights:[], mother: 111, births: 40, desease:'', pregnant:true, comments:'some comment', animalType:'animal type', weaning: 80, herd_num: '555'}
            ],
            groups: [{name: 'group 1', id: 1}, {name: 'group 2', id: 2}],
            types: [],
            newAnimal: {
                iron_num: '', herd_num: '', gov_id: '', gender: 'F', group_id: '', gen_1: '', birth_date: '', animal_type: ''
            },
            selectedAnimal: {
                newValues:{
                    gov_id:{},
                    iron_num:{},
                    herd_num:{},
                    _type:{},
                    gen_1:{},
                    group:{},
                    gender:{},
                    birth_date:{}
                }
            }
        }
    }

    componentDidMount(){
        animalDAO.getAllAnimals().then(res => {
            let { animals } = res.data;
            animals = animals.map(animal => {
                const entries = Object.entries(animal);
                const ct = animal.calving_times;
                const fBirth = new Date(ct[0]);
                const lBirth = new Date(ct[ct.length-1]);
                const calc = (lBirth - fBirth)/DAY;
                animal.avgBirthGap = calc ? calc : 0;
                animal.newValues = {};
                entries.forEach(attr => {
                    animal.newValues[attr[0]] = {value: '', displayMode:'view'};
                });

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
        this.setState({animalInfoModal:true, selectedAnimal:this.state.animals[index]});
    }

    closeInfoModal = () => {
        this.setState({animalInfoModal:false});
    }

    handleAnimalEditChange = e => {
        const { value, name } = e.target;
        const { animals, selectedAnimal } = this.state;
        const attr = selectedAnimal.newValues[name];
        attr.value = value;

        this.setState({animals:animals});
    }

    changeDisplayMode = (name, displayMode) => {
        console.log('change display mode');
        console.log('name:', name);
        console.log('mode:', displayMode);
        const { animals, selectedAnimal } = this.state;
        console.log('animal', selectedAnimal)
        selectedAnimal.newValues[name].displayMode = displayMode;

        this.setState({animals:animals});
    }

    updateAnimal = (animal, newValue, valueName) => {
        const { id } = animal;
        const updateAnimal = {};
        updateAnimal.id = id;
        updateAnimal[valueName] = newValue;
        animalDAO.updateAnimal(updateAnimal)
        .then(res => {
            animal[valueName] = newValue;
            this.setState({});
        }).catch(err => {
            console.error(err);
        });
    }

    render(){
        const { createAnimalModal, animalInfoModal, newAnimal } = this.state;
        const { animals, groups, types, selectedAnimal } = this.state;
        const animalRows = animals.map((animal, index) => <Animal animal={animal} key={animal.id} openInfoModal={() => this.openInfoModal(index)} />)
        return (
            <div className="container-fluid">
                <div className="row flex-xl-nowrap rtl">
                    <SideBar openCreateAnimal={this.openCreateAnimal} />
                    <AnimalsTable>
                        {animalRows}
                    </AnimalsTable>
                    <CreateAnimalModal isOpen={createAnimalModal} onAfterOpen={() => {}} onRequestClose={this.closeCreateAnimalModal} contentLabel="" groups={groups} types={types} save={this.saveAnimal} newAnimal={newAnimal} handleChange={this.handleCreateAnimalChange} animals={animals} />

                    <AnimalInfoModal isOpen={animalInfoModal} onAfterOpen={() => {}} onRequestClose={this.closeInfoModal} contentLabel="modal label" animal={selectedAnimal} animals={animals} handleChange={this.handleAnimalEditChange} changeDisplayMode={this.changeDisplayMode} types={types} groups={groups} updateAnimal={this.updateAnimal} />
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

const CreateAnimalModal = props => {
    const { newAnimal, groups, types, handleChange, animals } = props; 
    const groupOptions = groups.map(group => <option value={group.id} key={group.id}>{group.name}</option>);
    const typeOptions = types.map(t => <option value={t.id} key={t.id}>{t._type}</option>);
    const motherOptions = animals.map(animal => <option value={animal.id} key={animal.id}>{animal.gov_id}</option>);
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
                        <option value="">בחר קבוצה</option>
                        {groupOptions}
                    </SelectField>
                    <InputField inputName="gen_1" inputType="number" value={newAnimal.gen_1} handleChange={handleChange} inputLable="מספר ממשלתי של האם" />
                    <SelectField name="mother_id" value={newAnimal.mother_id} handleChange={handleChange} inputLable="בחר מספר ממשלתי של האם">
                        <option value="">בחר כבשה מתוך הרשימה</option>
                        {motherOptions}
                    </SelectField>
                    <InputField inputName="birth_date" inputType="date" value={newAnimal.birth_date} handleChange={handleChange} inputLable="תאריך לידה" />
                    <SelectField name="animal_type" value={newAnimal.animal_type} handleChange={handleChange} inputLable="Type" >
                        <option value="">בחר type</option>
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
    return (
        <div className="col-4 mb-2">
            <InputField2 {...props} />
        </div>
    );
}

const InputField2 = props => {
    const { inputName, inputType, value, handleChange, inputLable } = props;
    return (
        <div className="input-group border border-primary rounded"  dir="ltr">
            <input type={inputType} name={inputName} className="form-control" value={value} onChange={handleChange} />
            <div className="input-group-append"><span className="input-group-text rtl">{inputLable}</span></div>
        </div>
    );
}

const SelectField = props => {
    return (
        <div className="col-4 mb-2">
            <SelectField2 {...props}>
            </SelectField2>
        </div>
    );
}

const SelectField2 = props => {
    const { name, value, handleChange, children, inputLable } = props;
    return (
        <div className="input-group border border-primary rounded"  dir="ltr">
            <select  name={name} className="form-control" value={value} onChange={handleChange}>
                {children}
            </select>
            <div className="input-group-append"><span className="input-group-text">{inputLable}</span></div>
        </div>
    );
}

const AnimalInfoModal = props => {
    const { animal, handleChange, changeDisplayMode, types, animals, groups, updateAnimal } = props
    const newValues = animal.newValues ? animal.newValues : {};
    const now = Date.now();
    const age = timeSinceFormat(now - new Date(animal.birth_date));
    const pregnant = animal.pregnant ? 'כן' : 'לא';
    const sex = animal.gender === 'F' ? 'נקבה' : 'זכר';
    const timeSinceLastCalving = animal.calving_times ? now - new Date(animal.calving_times[animal.calving_times.length-1]) : 0;
    const tSLCFormat = timeSinceFormat(timeSinceLastCalving);
    const numOfcalvings = animal.calving_sizes && animal.calving_sizes.length ?animal.calving_sizes.length : 0; 
    const avgBirthSize = numOfcalvings ? animal.calving_sizes.reduce((total, size) => total += size) / numOfcalvings : 0;
    const udderRanks = animal.udder ? animal.udder.map((rank, index) => {
        return(
            <div>
                מספר {index}: {rank}
            </div>
        );
    }) : null;
    const typeOptions = typesToOptions(types);
    const motherOptions = animalsToOptions(animals);
    const groupOptions = groupsToOptions(groups);
    return (
        <Modal isOpen={props.isOpen} 
        onAfterOpen={props.onAfterOpen} 
        onRequestClose={props.onRequestClose}
        contentLabel={props.contentLabel}>
            <div className="jumbotron jumbotron-fluid text-right p-3 rounded">
                <div className="row rtl">
                    <AnimalField 
                        displayMode={newValues.gov_id.displayMode} 
                        inputName="gov_id" 
                        inputType="number" 
                        newValue={newValues.gov_id.value} 
                        handleChange={handleChange} 
                        label="מספר ממשלתי" 
                        value={animal.gov_id}
                        buttons={{edit: true}}
                        changeDisplayMode={changeDisplayMode}
                        updateAnimal={updateAnimal}
                        animal={animal}
                    />
                    <AnimalField 
                        displayMode={newValues.herd_num.displayMode} 
                        inputName="herd_num" 
                        inputType="number" 
                        newValue={newValues.herd_num.value} 
                        handleChange={handleChange} 
                        label="מספר עדר" 
                        value={animal.herd_num} 
                        buttons={{edit: true}}
                        changeDisplayMode={changeDisplayMode}
                        updateAnimal={updateAnimal}
                        animal={animal}
                    />
                    <AnimalField 
                        displayMode={newValues.iron_num.displayMode} 
                        inputName="iron_num" 
                        inputType="number" 
                        newValue={newValues.iron_num.value} 
                        handleChange={handleChange} 
                        label="מספר ברזל" 
                        value={animal.iron_num}
                        buttons={{edit: true}}
                        changeDisplayMode={changeDisplayMode}
                        updateAnimal={updateAnimal}
                        animal={animal}
                    />
                    <AnimalField 
                        displayMode={newValues._type.displayMode} 
                        inputName="_type" 
                        inputType="number" 
                        newValue={newValues._type.value} 
                        handleChange={handleChange} 
                        label="Type" 
                        value={animal._type}
                        buttons={{select: true}}
                        changeDisplayMode={changeDisplayMode}
                        selectOptions={typeOptions}
                        updateAnimal={updateAnimal}
                        animal={animal}
                    />
                    <AnimalField 
                        displayMode={newValues.gen_1.displayMode} 
                        inputName="gen_1" 
                        inputType="number" 
                        newValue={newValues.gen_1.value} 
                        handleChange={handleChange} 
                        label="אמא" 
                        value={animal.gen_1}
                        buttons={{edit: true, select: true}}
                        changeDisplayMode={changeDisplayMode}
                        selectOptions={motherOptions}
                        updateAnimal={updateAnimal}
                        animal={animal}
                    />
                    <AnimalField 
                        displayMode={newValues.gender.displayMode} 
                        inputName="gender" 
                        inputType="text" 
                        newValue={newValues.gender.value} 
                        handleChange={handleChange} 
                        label="מין" 
                        value={sex}
                        buttons={{select: true}}
                        changeDisplayMode={changeDisplayMode}
                        selectOptions={genderOptions}
                        updateAnimal={updateAnimal}
                        animal={animal}
                    />
                    <AnimalField 
                        displayMode={newValues.birth_date.displayMode} 
                        inputName="birth_date" 
                        inputType="date" 
                        newValue={newValues.birth_date.value} 
                        handleChange={handleChange} 
                        label="גיל" 
                        value={age}
                        buttons={{edit: true}}
                        changeDisplayMode={changeDisplayMode}
                        updateAnimal={updateAnimal}
                        animal={animal}
                    />
                    <AnimalField 
                        displayMode={newValues.group.displayMode} 
                        inputName="group" 
                        inputType="number" 
                        newValue={newValues.group.value} 
                        handleChange={handleChange} 
                        label="קבוצה" 
                        value={animal.group}
                        buttons={{select: true}}
                        changeDisplayMode={changeDisplayMode}
                        selectOptions={groupOptions}
                        updateAnimal={updateAnimal}
                        animal={animal}
                    />
                </div>
                <div className="row rtl">
                    <ExtendedViewField label="המלטות">
                        <ExtendedViewRow label="בהריון" value={pregnant} />
                        <ExtendedViewRow label="המלטה אחרונה לפני" value={tSLCFormat} />
                        <ExtendedViewRow label="מרווח ממוצע בין המלטות" value={animal.avgBirthGap} />
                        <ExtendedViewRow label="גודל המלטה ממוצע" value={avgBirthSize} />
                        <ExtendedViewRow label="מספר המלטות" value={numOfcalvings} />
                    </ExtendedViewField>
                    <ExtendedViewField label="הערות">{animal.comments}</ExtendedViewField>
                    <ExtendedViewField label="דירוג עטין">
                        {udderRanks}
                    </ExtendedViewField>
                    <ExtendedViewField label="מחלה">
                        <ComponentSwitch selected={animal.illness_start_time ? 'sick' : 'healthy'}>
                            <span case="healthy" className="card-text">
                                הכבשה בריאה
                            </span>
                            <span case="sick">
                                חולה מתאריך: {moment(animal.illness_start_time).format('MM-DD-YYYY')}
                                {animal.illness}
                            </span>
                        </ComponentSwitch>
                    </ExtendedViewField>
                </div>
            </div>
        </Modal>
    );
}

const AnimalField = props => {
    const { displayMode, inputName, inputType, newValue, handleChange, label, value, buttons, changeDisplayMode, selectOptions, animal, updateAnimal } = props;
    const editButton = buttons.edit ? 
        <button className="btn btn-warning col-4" onClick={() => changeDisplayMode(inputName, 'edit')}>ערוך</button> : null;
    const selectButton = buttons.select ?
        <button className="btn btn-warning col-4" onClick={() => changeDisplayMode(inputName, 'select')}>בחר</button> : null;
    const viewButton = 
        <button className="btn btn-primary col-4" onClick={() => changeDisplayMode(inputName, 'view')}>תצוגה</button>;
    return (
        <div className="col-3 card p-2 mb-2 border border-primary border-rounded">
            <div className="row px-3 mb-2">
                <ComponentSwitch selected={displayMode}>
                    <ViewField case="view" label={label} value={value} />
                    <div case="edit">
                        <InputField2 
                            inputName={inputName} 
                            inputType={inputType} 
                            value={newValue} 
                            handleChange={handleChange} 
                            inputLable={label} 
                        />
                        <button className="btn btn-success"
                            onClick={e => {
                                e.preventDefault();
                                updateAnimal(animal, newValue, inputName);
                                console.log('update animal')
                            }}
                        >
                            שמור
                        </button>
                    </div>
                    <div case="select">
                        <SelectField2 name={inputName} value={newValue} handleChange={handleChange} inputLable={label} >
                            {selectOptions}
                        </SelectField2>
                        <button className="btn btn-success"
                            onClick={e => {
                                e.preventDefault();
                                updateAnimal(animal, newValue, inputName);
                                console.log('update animal')
                            }}
                        >
                            שמור
                        </button>
                    </div>
                </ComponentSwitch>
            </div>
            <div className="row px-3">
                {editButton}
                {selectButton}
                {viewButton}
            </div>
        </div>
    )
}

const ViewField = props => {
    const { label, value } = props;
    return (
        <div>
            {label}: {value}
        </div>
    );
}

const ExtendedViewField = props => {
    const { label, children } = props;
    return (
        <div className="col-3 card mb-2 border border-primary border-rounded">
            <div className="card-body">
                <h5 className="card-title">{label}</h5>
                {children}
            </div>
        </div>
    );
}

const ExtendedViewRow = props => {
    const { label, value } = props;
    return (
        <div><span>{label}: {value}</span></div>
    );
}

const timeSinceFormat = (ms) => {
    const miliSec = ms && ms > 0 ? ms : 0;
    const years = Math.floor(miliSec/YEAR);
    const months = Math.floor(miliSec/(30 * DAY)) % 12;
    const days = Math.floor(miliSec/DAY) % 30;
    let ans = '';
    if (years === 1)
        ans += 'שנה' ;
    else if (years > 1)
        ans += years + ' שנים';
    if (ans.length) {
        if (months === 1)
            ans += ' וחודש';
        else if (months > 1)
            ans += ' ו-' + months + ' חודשים';
    }
    else {
        if (months === 1)
            ans += 'חודש';
        else if (months > 1)
            ans += months + ' חודשים';
        if (months) {
            if (days === 1)
                ans += ' ויום';
            else
                ans += ' ו-' + days + ' ימים';
        }
        else {
            if (days === 1)
                ans += 'יום';
            else
                ans += days + ' ימים';
        }
    }
    return ans;
}

const typesToOptions = types => {
    return types.map(t => <option value={t.id} key={t.id}>{t._type}</option>);
}

const animalsToOptions = animals => {
    return animals.map(animal => <option value={animal.id} key={animal.id}>{animal.gov_id}</option>);
}

const genderOptions = [
    <option value="F" key="F">נקבה</option>,
    <option value="M" key="M">זכר</option>
]

const groupsToOptions = groups => {
    return groups.map(group => <option value={group.id} key={group.id}>{group.name}</option>);
}
