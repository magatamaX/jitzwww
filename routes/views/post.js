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
	};

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		}).populate('author categories');

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

	// Load other posts
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

	// Render the view
	view.render('post');
};
