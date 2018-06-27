import { types } from "mobx-state-tree";

const Udder = types.model('Udder', {
    rank: types.number,
    time: types.Date
})

export default Udder;