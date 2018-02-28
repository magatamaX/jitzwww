var keystone = require('keystone');

/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
  autokey: { from: 'name', path: 'key', unique: true },
  label: 'カテゴリ',
  plural: 'カテゴリ',
});

PostCategory.add({
  name: { type: String, required: true, label: 'カテゴリ名' },
  japanese: { type: String, label: '日本語カテゴリ名' },
  category_ID: { type: String, default: '', noedit: true, index: true },
});

PostCategory.schema.pre('save', function (next) {
		this.category_ID = this._id;
	next();
});

PostCategory.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' });

PostCategory.defaultColumns = 'name, japanese, category_ID';
PostCategory.register();
