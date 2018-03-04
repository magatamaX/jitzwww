var keystone = require('keystone');
var async = require('async');
var _ = require('lodash');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Init locals
  locals.section = 'blog';
  locals.filters = {
    category: req.params.category,
  };
  locals.data = {
    posts: [],
    categories: [],
    navigations: [],
  };

  // Load all categories
  view.on('init', function (next) {

    keystone.list('PostCategory').model.find().sort('name').exec(function (err, results) {

      if (err || !results.length) {
        return next(err);
      }

      locals.data.categories = results;

      // Load the counts for each category
      async.each(locals.data.categories, function (category, next) {

        keystone.list('Post').model.count().where('categories').in([category.id]).exec(function (err, count) {
          category.postCount = count;
          next(err);
        });

      }, function (err) {
        next(err);
      });
    });
  });

  // Load the current category filter
  view.on('init', function (next) {

    if (req.params.category) {
      keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
        locals.data.category = result;
        next(err);
      });
    } else {
      next();
    }
  });

  // Load the posts
  view.on('init', function (next) {

    var _filters;

    if(!req.params.category){
      _filters = {
        state: 'published',
      };
    } else {
      _filters = {
        state: 'published',
        categories: locals.data.category,
      };
    }

    var q = keystone.list('Post').paginate({
      page: req.query.page || 1,
      perPage: 10,
      maxPages: 10,
      filters: _filters,
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
  view.render('blog');
};
