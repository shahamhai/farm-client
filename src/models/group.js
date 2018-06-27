import { types } from "mobx-state-tree";
import groupDAO from '../dao/GroupDAO';

const Group = types.model('Group', {
    animals: types.number,
    id: types.number,
    name: types.string
}).actions(self => ({
    updateName(name) {
        const newName = name ? name.trim() : '';
        if (newName.length)
        groupDAO.updateGroup({id:self.id, name:newName})
        .then(() => {this.success(newName)})
        .catch(err => {
            console.error(err);
        });
    },
    success(newName) {
        self.name = newName;
    }
}));

export default Group;