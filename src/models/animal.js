import { types } from "mobx-state-tree";
import Calving from './calving';
import Udder from './udder';

const Animal = types.model("Animal", {
    _type: types.string,
    animal_type: types.number,
    birth_date: types.Date,
    calvings: types.array(Calving),
    comments: types.string,
    gen_1: types.number,
    gender: types.string,
    gov_id: types.number,
    group: types.string,
    herd_num: types.number,
    id: types.number,
    illness: types.string,
    illness_start_time: types.Date,
    iron_num: types.number,
    pregnant: types.boolean,
    udderRankings: types.array(Udder)
}).actions(self => ({
    
})).views(self => ({
    option() {
        return {value:self.id, display:self.gov_id};
    },
    avgBirthGap() {
        const length = self.calvingList.length;
        return length ? 
            self.calvings[0].calving_time - self.calvings[length-1] : 0;
    }
}));


export default Animal;
