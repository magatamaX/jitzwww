var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post,
    category: req.params.category,
	};
	locals.data = {
		posts: [],
    categories: [],
    recommend: [],
		navigations: [],
	};

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		}).populate('author categories series');

		q.exec(function (err, result) {
			locals.data.post = result;
			next(err);
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

	// Load Recommend posts
	view.on('init', function (next) {

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
	view.render('post');
};
