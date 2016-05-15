import {Template} from "meteor/templating";
import {sAlert} from "meteor/juliancwirko:s-alert";
import {FlowRouter} from "meteor/kadira:flow-router";
import {$} from "meteor/jquery";
import {Tracker} from "meteor/tracker";
import {Chronos} from "meteor/remcoder:chronos";
import {Rooms} from "../../api/rooms/rooms.js";
import {Messages} from "../../api/messages/messages.js";
import "../components/room-item.html";
import "../components/player.html";
import "./rooms-show-page.html";

Template.Rooms_show_page.onCreated(function () {
    this.subscribe('messages', FlowRouter.current().params._id);
});

Template.Rooms_show_page.onRendered(function () {
    Messages.find().observe({
        added: function (post) {
            var chat = $('#chat');
            if (Session.get('scrollTop') === undefined || chat.scrollTop() === Session.get('scrollTop')) {
                chat.scrollTop(chat[0].scrollHeight);
                Session.set('scrollTop', chat.scrollTop());
            }
        }
    });
});

Template.Rooms_show_page.helpers({
    room() {
        return Rooms.findOne(FlowRouter.current().params._id);
    },
    messages() {
        return Messages.find({});
    },
    canJoin() {
        return true;
    },
    joined() {
        return Rooms.findOne({_id: FlowRouter.current().params._id, 'game.players': {userId: Meteor.userId(), score: 0}});
    },
    waitingFor() {
        return 2 - Rooms.findOne(FlowRouter.current().params._id).game.players.length;
    },
    word() {
        var player = Rooms.findOne(FlowRouter.current().params._id).game.players.filter(function (player) {
            return (player.userId === Meteor.userId());
        })[0];
        if (player.good) {
            return player.word;
        } else {
            return false;
        }
    },
    countdown() {
        return Rooms.findOne(FlowRouter.current().params._id).game.countdown.getSeconds() - Chronos.currentTime().getSeconds();
    },
    progress() {
        return 1 - (Rooms.findOne(FlowRouter.current().params._id).game.progress.getTime() - Chronos.currentTime().getTime()) / 60000;
    }
});

Template.Rooms_show_page.events({
    'click #join'() {
        sAlert.info('Enregistrement en cours...');
        Meteor.call('rooms.join', FlowRouter.current().params._id, function (error) {
            if (error) {
                sAlert.error('Erreur lors de l’enregistrement !');
            } else {
                sAlert.success('Vous êtes bien enregistré pour la prochaine partie.');
            }
        });
    },
    'click #leave'() {
        sAlert.info('Enregistrement en cours...');
        Meteor.call('rooms.leave', FlowRouter.current().params._id, function (error) {
            if (error) {
                sAlert.error('Erreur lors de l’enregistrement !');
            } else {
                sAlert.success('Vous n’êtes plus enregistré pour la prochaine partie.');
            }
        });
    },
    'keypress #input': function (e) {
        if (e.which === 13) {
            e.preventDefault();
            var input = $('#input');
            if (input.val()) {
                Meteor.call('messages.insert', {
                    type: 'message',
                    message: input.val(),
                    name: Meteor.user().profile.name,
                    roomId: FlowRouter.current().params._id
                });
                input.val('');
            }
        }
    },
    'keypress #synonym-input': function (e) {
        if (e.which === 13) {
            e.preventDefault();
            var synonym = $('#synonym-input');
            Meteor.call('synonyms.validate', FlowRouter.current().params._id, synonym.val(), function (error, result) {
                if (!result) {
                    synonym.val('');
                    Meteor.call('rooms.type', FlowRouter.current().params._id, '');
                }
            });
        }
    },
    'input #synonym-input': function () {
        Meteor.call('rooms.type', FlowRouter.current().params._id, $('#synonym-input').val());
    }
});

Template.player.helpers({
    initial() {
        var nameSplitted = Meteor.users.findOne(this.userId).profile.name.split(' ');
        console.log(nameSplitted);
        return nameSplitted[0][0] + nameSplitted[1][0];
    },
    bars(max) {
        return Array.apply(null, new Array(max)).map(function (x, i) { return i; });
    }
});