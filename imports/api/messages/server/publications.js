import { Meteor } from 'meteor/meteor';

import { Messages } from '../messages.js';

Meteor.publish('messages', function messages(roomId) {
    return Messages.find({
        roomId: roomId
    }, {
        fields: Messages.publicFields
    });
});