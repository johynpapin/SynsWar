import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { $ } from 'meteor/jquery';

import { Rooms } from '../../api/rooms/rooms.js';

import './rooms-list-page.html';

Template.Rooms_list_page.helpers({
    rooms() {
        return Rooms.find({ $or: [
            { userId: { $exists: false } },
            { userId: Meteor.userId() }
        ] });
    },
    name() {
        return Meteor.user().profile.name;
    }
});

Template.Rooms_list_page.events({
    'click #public'() {
        if(Meteor.userId()) {
            const roomName = $('#room-name').val();
            if (roomName) {
                sAlert.info('Création du salon public « ' + roomName + ' » ...');
                Meteor.call('rooms.insert', {name: roomName, isPrivate: false}, function (error) {
                    if (error) {
                        sAlert.error('Une erreur est survenue lors de la création du salon.');
                    } else {
                        sAlert.success('Le salon « ' + roomName + ' » a bien été créé !');
                    }
                });
            } else {
                sAlert.error('Veuillez donner un nom au salon !');
            }
        } else {
            sAlert.warning('Vous devez être connecté afin de créer un salon !');
        }
    },
    'click #private'() {
        if(Meteor.userId()) {
            const roomName = $('#room-name').val();
            if(roomName) {
                sAlert.info('Création du salon privé « '+roomName+' » ...');
                Meteor.call('rooms.insert', { name: roomName, isPrivate: true}, function(error) {
                    if(error) {
                        sAlert.error('Une erreur est survenue lors de la création du salon.');
                    } else {
                        sAlert.success('Le salon « '+roomName+' » a bien été créé !');
                    }
                });
            } else {
                sAlert.error('Veuillez donner un nom au salon !');
            }
        } else {
            sAlert.warning('Vous devez être connecté afin de créer un salon !');
        }
    },
    'click #logout'() {
        sAlert.info('Déconnexion en cours...');
        Meteor.logout();
        sAlert.success('Vous êtes bien déconnecté.');
        FlowRouter.go('App.login');
    }
});