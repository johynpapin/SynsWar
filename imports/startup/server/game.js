import { Meteor } from 'meteor/meteor';

import { Rooms } from '../../api/rooms/rooms.js';

Rooms.after.update(function (userId, doc, fieldNames, modifier) {
    if(fieldNames.indexOf('game') !== -1) {
        if(modifier.$unset !== undefined && modifier.$unset['game.countdown'] === '' && doc.game.inprogress === false) { // Début de la partie
            Rooms.update({_id: doc._id}, {
                $set: {
                    'game.inprogress': true,
                    'game.word': Meteor.call('synonyms.random')
                },
                $unset: { winner: '' }
            });
            Meteor.call('rooms.progress', doc._id, function () {
            });
        } else if(modifier.$unset !== undefined && modifier.$unset['game.progress'] === '' && doc.winner !== undefined) { // Fin de la partie
            Rooms.update({_id: doc._id}, { $set: {game: {inprogress: false, players: []}}});
        } else if(modifier.$unset !== undefined && modifier.$unset['game.progress'] === '') { // Fin du round
            Rooms.update({_id: doc._id}, { $set: {'game.answer': Meteor.call('synonyms.synonym', doc.game.word)}});
            Meteor.call('rooms.countdown', doc._id, function() {});
        } else if(modifier.$unset !== undefined && modifier.$unset['game.countdown'] === '' && doc.game.inprogress === true) { // Début du round
            var players = Rooms.findOne({_id: doc._id}).game.players;
            players.forEach(function (player) {
                player.word = ''; player.good = false;
            });
            Rooms.update({_id: doc._id}, {$set: {'game.players': players, 'game.word': Meteor.call('synonyms.random')}});
            Meteor.call('rooms.progress', doc._id,  function() {});
        }
    }
}, {fetchPrevious: false});