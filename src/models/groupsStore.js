import { types } from 'mobx-state-tree';
import Group from './group';
import groupDAO from '../dao/GroupDAO';

const GroupsStore = types.model('GroupsStore', {
    groups: types.array(Group),
    newGroup: Group
}).actions(self => ({
    getAllGroups() {
        groupDAO.getAllGroups()
        .then(self.getGroupsSuccess)
        .catch(err => {

        })
    },

    getGroupsSuccess(res) {
        console.log(res.data.groups[0]);
        self.groups = res.data.groups;
    },

    removeGroup(group) {
        self.groups.splice(self.groups.indexOf(group), 1);
    },

    createGroup(group) {
        self.groups.push(group);
    }
}))

const groupsStore = GroupsStore.create({groups:[], newGroup:{animals:0, id:-1, name:''}});

export default groupsStore;