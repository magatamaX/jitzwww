var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Author Model
 * ==========
 */
var Author = new keystone.List('Author', {
  autokey: { from: 'name', path: 'key', unique: true },
  label: '著者',
  plural: '著者',
});

Author.add({
  name: { type: Types.Name, required: true, index: true },
  japanese: { type: String, required: true, initial: true, index: true },
  company: { type: String, index: true },
  email: { type: Types.Email, unique: true, index: true },
  profile: { type: Types.Html, wysiwyg: true, height: 400 },
  website: { 
    title: { type: String, index: true },
    url: { type: Types.Url, index: true },
  },
});


/**
 * Relationships
 */
Author.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
Author.defaultColumns = 'name, japanese, company';
Author.register();
