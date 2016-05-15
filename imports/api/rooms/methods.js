import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';

import { Rooms } from './rooms.js';

Meteor.methods({
    'rooms.insert'(room) {
        Rooms.insert(room);
    },
    'rooms.remove'(roomId) {
        Rooms.remove(roomId);
    },
    'rooms.join'(roomId) {
        Rooms.update({_id: roomId}, {$addToSet: {'game.players': {userId: Meteor.userId(), score: 0}}});
        var game = Rooms.findOne(roomId).game;
        if(game.players.length === 2 && game.countdown === undefined) {
            Meteor.call('rooms.countdown', roomId, function() {});
        }
    },
    'rooms.leave'(roomId) {
        Rooms.update({_id: roomId}, {$pull: {'game.players': {userId: Meteor.userId(), score: 0}}});
        var game = Rooms.findOne(roomId).game;
        if(game.players.length < 2 && game.countdown !== undefined) {
            Rooms.update({_id: roomId}, {$unset: {'game.countdown': ""}});
        }
    },
    'rooms.messages.insert'(roomId, messageId) {
        Rooms.update({_id: roomId}, {$addToSet: {messages: messageId}});
    },
    'rooms.type'(roomId, synonym) {
        Rooms.update({_id: roomId, 'game.players.userId': Meteor.userId()}, {$set: {'game.players.$.word': synonym}});
    },
    'rooms.validate'(roomId) {
        Rooms.update({_id: roomId, 'game.players.userId': Meteor.userId()}, {$set: {'game.players.$.good': true}, $inc: {'game.players.$.score': 1}});
        Rooms.findOne({_id: roomId, 'game.players.good': true}).game.players.forEach((player) => {
            if(player.userId === Meteor.userId()) {
                if(player.score == 10) {
                    console.log(player.score);
                    console.log(Meteor.user().profile.name);
                    console.log('Updating, end of the round.');
                    Rooms.update({_id: roomId}, {$set: {winner: Meteor.user().profile.name}, $unset: {'game.progress': ''}});
                } else {
                    Rooms.update({_id: roomId}, {$unset: {'game.progress': ''}});
                }
            }
        });

    },
    'rooms.countdown'(roomId) {
        const date = moment().add(10, 's').toDate();
        Rooms.update({_id: roomId}, {$set: {'game.countdown': date}});
        Meteor.setTimeout(() => {
            var c = Rooms.findOne(roomId).game.countdown;
            if(c != undefined && c.getTime() == date.getTime()) {
                Rooms.update({_id: roomId}, {$unset: {'game.countdown': ''}});
            }
        }, 10000);
    },
    'rooms.progress': function(roomId) {
        const date = moment().add(1, 'm').toDate();
        Rooms.update({_id: roomId}, {$set: {'game.progress': date}});
        Meteor.setTimeout(() => {
            var p = Rooms.findOne(roomId).game.progress;
            if(p != undefined && p.getTime() == date.getTime()) {
                Rooms.update({_id: roomId}, {$unset: {'game.progress': ''}});
            }
        }, 60000);
    }
});
