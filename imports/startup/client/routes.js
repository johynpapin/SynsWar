import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Rooms } from '../../api/rooms/rooms.js'

// Import to load these templates
import '../../ui/layouts/app-body.js';
import '../../ui/pages/home-page.js';
import '../../ui/pages/rooms-list-page.js';
import '../../ui/pages/rooms-show-page.js';
import '../../ui/pages/login-page.js';
import '../../ui/pages/app-not-found.js';

function checkNotLoggedIn(context, redirect) {
    if(Meteor.userId()) {
        redirect('App.home');
    }
}

function notFound(context, redirect, stop) {
    if(Rooms.findOne(context.params) === undefined) {
        BlazeLayout.render('App_body', { main: 'App_not_found' });
        stop();
    }
}

FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', { main: 'Home_page' });
    }
});

FlowRouter.route('/rooms', {
    name: 'App.rooms',
    action() {
        BlazeLayout.render('App_body', { main: 'Rooms_list_page' });
    }
});

FlowRouter.route('/rooms/:_id', {
    name: 'Rooms.show',
    triggersEnter: [notFound],
    action(params) {
        BlazeLayout.render('App_body', {
            main: 'Rooms_show_page',
            data: Rooms.findOne(params)
        });
    }
});

FlowRouter.route('/login', {
    name: 'App.login',
    triggersEnter: [checkNotLoggedIn],
    action() {
        BlazeLayout.render('App_body', { main: 'Login_page' });
    }
});

FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', { main: 'App_not_found' });
    }
};