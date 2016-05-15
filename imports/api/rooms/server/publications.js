import { Meteor } from 'meteor/meteor';

import { Rooms } from '../rooms.js';

Meteor.publish('rooms.public', function roomsPublic() {
    return Rooms.find({
        isPrivate: false
    }, {
        fields: Rooms.publicFields
    });
});

Meteor.publish('rooms.private', function roomsPrivate() {
    return Rooms.find({
        isPrivate: true
    }, {
        fields: Rooms.publicFields
    });
});