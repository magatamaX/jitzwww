var keystone = require('keystone');
// var navigations = require('./navi');
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
    navigations: [],
  };

  // Load the posts（トップのスライダー）
  view.on('init', function(next) {

      var s = keystone.list('Post').paginate({
        page: req.query.page || 1,
        perPage: 5,
        maxPages: 1,
        filters: {
          state: 'published',
          slide: true,
        },
      })
        .sort('-publishedDate')
        .populate('author categories');

      s.exec(function (err, results) {
        locals.data.slide = results;
        next(err);
      });

  });

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

  /* ------------------------------
    ヘッダナビゲーション
  -- --------------------------- */
  // Load all categories
  view.on('init', function (next) {

    keystone.list('PostCategory').model.find().sort('category_No').exec(function (err, results) {

      if (err || !results.length) {
        return next(err);
      }

      locals.data.navigations = results;

      // Load the posts for each category
      async.each(locals.data.navigations, function (category, next) {

        // recommend area
        keystone.list('Post').model.find({
          state: 'published',
          recommend: true,
        })
        .sort('-publishedDate')
        .where('categories')
        .in([category.id])
        .limit(6)
        .exec(function (err, results) {

          category.categoryPostsRecommend = results;

          // new posts area
          keystone.list('Post').model.find({
            state: 'published',
          })
          .sort('-publishedDate')
          .where('categories')
          .in([category.id])
          .limit(5)
          .exec(function (err, results) {

            category.categoryPostsOrdered = results;

            next(err);
          });

        });

      }, function (err) {
        next(err);
      });
    });
  });


  // Render the view
  view.render('index');
};
