import { Meteor } from 'meteor/meteor';

import { synonyms } from './data.js';
import { Rooms } from '../rooms/rooms.js';


Meteor.methods({
    'synonyms.random'() {
        const keys = Object.keys(synonyms);
        return keys[keys.length * Math.random() << 0];
    },
    'synonyms.validate'(roomId, synonym) {
        if(synonyms[Rooms.findOne(roomId).game.word].indexOf(synonym) !== -1 && Rooms.findOne({_id: roomId, 'game.players.word': synonym}) !== undefined) {
            Meteor.call('rooms.validate', roomId, function() {});
            return true;
        } else {
            return false;
        }
    },
    'synonyms.synonym'(synonym) {
        return synonyms[synonym][0];
    }
});
