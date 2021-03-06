// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var fs = require('fs');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

var accessLogStream = fs.createWriteStream('public/access.log', {flags: 'a'});

keystone.init({
  'name': 'jitzwww',
  'brand': '実務家Link',

  'sass': 'public',
  'static': 'public',
  'favicon': 'public/favicon.ico',
  'views': 'templates/views',
  'view engine': 'pug',

  'auto update': true,
  'mongo': process.env.MONGO_URI || 'mongodb://jitzuser:4V1CV>uyl}M.8h+D@localhost/jitzwww',
  'session': true,
  'auth': true,
  'user model': 'User',
  'port': 36791,

  'ga property': process.env.GA_PROPERTY,
  'ga domain': process.env.GA_DOMAIN,

  'logger': 'combined',
  'logger options': {
    stream: accessLogStream,
  },

  'wysiwyg images': true,
  'wysiwyg menubar': true,

  'trust proxy' : true,

});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
  _: require('lodash'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
  posts: ['posts', 'post-categories', 'post-series'],
  authors: 'authors',
  galleries: 'galleries',
  enquiries: 'enquiries',
  users: 'users',
});

// Start Keystone to connect to your database and initialise the web server



keystone.start();
