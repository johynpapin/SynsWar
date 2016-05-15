import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class MessagesCollection extends Mongo.Collection {
    insert(message, callback) {
        message.date = new Date();
        return super.insert(message, callback);
    }
}

export const Messages = new MessagesCollection('Messages');

Messages.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Messages.schema = new SimpleSchema({
    date: { type: Date, optional: false },
    type: { type: String, optional: false },
    message: { type: String, optional: true },
    name: { type: String, optional: true },
    roomId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: false }
});

Messages.attachSchema(Messages.schema);

Messages.publicFields = {
    date: 1,
    type: 1,
    message: 1,
    name: 1
};