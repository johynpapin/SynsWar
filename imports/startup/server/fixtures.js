import { Meteor } from 'meteor/meteor';

import { Rooms } from '../../api/rooms/rooms.js';

Meteor.startup(() => {
    Rooms.remove({});
});