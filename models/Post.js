var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'uniqueUrl', unique: true },
  defaultSort: '-publishedDate',
  label: '投稿',
  plural: '投稿',
});

Post.add({
  title: { type: String, required: true, label: '記事タイトル' },
  // subtitle: { type: String, label: 'サブタイトル' },
  uniqueUrl: { type: String, label: 'ユニークパス' },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true, label: '状態' },
  recommend: { type: Types.Boolean, index: true, label: 'おすすめに表示' },
  slide: { type: Types.Boolean, index: true, label: 'トップのスライダーに表示' },
  author: { type: Types.Relationship, ref: 'Author', index: true, label: '著者' },
  user: { type: Types.Relationship, ref: 'User', index: true },
  publishedDate: { type: Types.Datetime, default: Date.now, index: true, dependsOn: { state: 'published' } },
  image: { type: Types.CloudinaryImage },
  content: {
    brief: { type: Types.Html, wysiwyg: true, height: 150 },
    extended: { type: Types.Html, wysiwyg: true, height: 800 },
  },
  categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
  isSeries: { type: Types.Boolean, index: true, default: false, label: '連載'},
  series: { type: Types.Relationship, ref: 'PostSeries', index: true, label: '連載タイトル', dependsOn: { isSeries: true } },
  seriesCount: { type: Number, label: '連載カウント', dependsOn: { isSeries: true } },
  isSeriesFinal : { type: Types.Boolean, label: '最終回', dependsOn: { isSeries: true } },
});

Post.schema.virtual('content.full').get(function () {
  return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title|40%, state|10%, author|20%, publishedDate|20%, recommend, slide';
Post.register();
