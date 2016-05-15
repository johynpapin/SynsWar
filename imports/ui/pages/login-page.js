import { Template } from 'meteor/templating';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './login-page.html';

Template.Login_page.events({
    'click #facebook'() {
        sAlert.info('Connexion via facebook en cours...');
        Meteor.loginWithFacebook({
            requestPermissions: ['public_profile', 'email']
        }, (err) => {
            if (err) {
                sAlert.error('Une erreur est survenue lors de la connexion.');
            } else {
                sAlert.success('Salut, '+Meteor.user().profile.name+' !');
                FlowRouter.go('App.home');
            }
        });
    }
});

Template.Login_page.helpers({
    loggingIn() {
        return Meteor.loggingIn();
    }
});