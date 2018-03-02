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

      locals.data.categories = results;

      next();
    });
  });
  
  view.on('init', function(next) {
    
    // console.log(locals.data.categories.length);
    
    var cat_ary = [];
    var cat = locals.data.categories;
    var ldcl = locals.data.categories.length;
    var query;
    
    for ( var i=0; i<ldcl; i++ ){
      
      cat_ary.push(cat[i]._id);
      
    }
    console.log(cat_ary);
    
    // var query = keystone.list('Post').model.find().where('categories').populate('categories').sort('-publishedDate').limit(20);
    var query = keystone.list('Post').model.where('category_No').populate('categories').find({"category_No":"5"}).sort('-publishedDate').limit(5);
    // var t = keystone.list('Post').model.find({
    //   categories : {
    //     category_No : 2,
    //   },
    // }).limit(6)
    
    // var t = keystone.list('Post').paginate({
    //   page: 1,
    //   perPage: 6,
    //   maxPages: 1,
    //   filters: {
    //     state: 'published',
    //     categories: locals.data.category,
    //   },
    // })
    //   .sort('-publishedDate')
    //   .populate('categories');
    // 
    // if (locals.data.category) {
    //   t.where('categories').in([locals.data.category]);
    // }

    query.exec(function (err, results) {
      locals.data.navigations = results;
      for (var j=0; j<5; j++){
        console.log(results[j].categories[0].category_No);
      }
      next(err);
    });
    // console.log(locals.data.categories);
    
    
    // next();
    
  });
  
  

  // Render the view
  view.render('index');
};
