import './app-body.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../components/loading.js';

Template.App_body.onCreated(function appBodyOnCreated() {
    this.subscribe('rooms.public');
    this.subscribe('rooms.private');
});
