import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Messages } from '../messages/messages.js';

class RoomsCollection extends Mongo.Collection {
    insert(room, callback) {
        room.game = {
            inprogress: false,
            players: []
        };
        room.messages = [];
        room.master = Meteor.userId();
        return super.insert(room, callback);
    }
    remove(selector, callback) {
        return super.remove(selector, callback);
    }
}

export const Rooms = new RoomsCollection('Rooms');

Rooms.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Rooms.schema = new SimpleSchema({
    name: { type: String, optional: false },
    isPrivate: { type: Boolean, optional: false},
    game: { type: Object, optional: true },
    'game.inprogress': { type: Boolean },
    'game.players': { type: [Object] },
    'game.players.$.userId': { type: String, regEx: SimpleSchema.RegEx.Id},
    'game.players.$.score': { type: Number },
    'game.players.$.word': { type: String, optional: true },
    'game.players.$.good': { type: Boolean, optional: true },
    'game.countdown': { type: Date, optional: true},
    'game.word': { type: String, optional: true },
    'game.answer': { type: String, optional: true },
    'game.progress': { type: Date, optional: true },
    winner: { type: String, optional: true },
    messages: { type: [Messages], optional: false },
    master: { type: String, regEx: SimpleSchema.RegEx.Id, optional: false }
});

Rooms.attachSchema(Rooms.schema);

Rooms.publicFields = {
    name: 1,
    isPrivate: 1,
    users: 1,
    game: 1,
    messages: 1,
    master: 1,
    winner: 1
};

Rooms.helpers({
    
});