import { types } from "mobx-state-tree";

const Calving = types.model("Calving", {
    calving_time: types.Date,
    calving_size: types.number
});

export default Calving;