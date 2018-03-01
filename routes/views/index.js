var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';
  locals.filters = {
    category: req.params.category,
  };
  locals.data = {
    posts: [],
    categories: [],
    recommend: [],
  };

  // Load the posts（おすすめエリア）
  view.on('init', function(next) {
    
      var r = keystone.list('Post').paginate({
        page: req.query.page || 1,
        perPage: 6,
        maxPages: 1,
        filters: {
          state: 'published',
          recommend: true,
        },
      })
        .sort('-publishedDate')
        .populate('author categories');

      r.exec(function (err, results) {
        locals.data.recommend = results;
        next(err);
      });
    
  });

  // Load the posts（新着記事エリア）
  view.on('init', function (next) {

      var q = keystone.list('Post').paginate({
        page: req.query.page || 1,
        perPage: 10,
        maxPages: 10,
        filters: {
          state: 'published',
        },
      })
        .sort('-publishedDate')
        .populate('author categories series');

      if (locals.data.category) {
        q.where('categories').in([locals.data.category]);
      }

      q.exec(function (err, results) {
        locals.data.posts = results;
        next(err);
      });

  });

  // Render the view
  view.render('index');
};
