var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Series Model
 * ==========
 */
 
var PostSeries = new keystone.List('PostSeries', {
  autokey: { from: 'name', path: 'key', unique: true },
  label: '連載',
  plural: '連載',
});

PostSeries.add({
  name: { type: String, required: true, index: true, label: '連載名' },
  max: { type: Number, label: '連載全回数'},
  banner: { type: Types.CloudinaryImage },
});

PostSeries.relationship({ ref: 'Post', path: 'posts', refPath: 'series' });

PostSeries.defaultColumns = 'name';
PostSeries.register();
