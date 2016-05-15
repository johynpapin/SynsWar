import { Meteor } from 'meteor/meteor';

import { Messages } from './messages.js';

Meteor.methods({
    'messages.insert'(message) {
        const id = Messages.insert(message);
        Meteor.call('rooms.messages.insert', message.roomId, id);
    },
    'messages.remove'() {
        Messages.remove();
    }
});
