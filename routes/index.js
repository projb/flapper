var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



/* GET /posts - return a list of posts and associated metadata */
router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts){
		if(err){ return next(err); }

		res.json(posts);
	});
});

/* POST /posts - create a new post */
router.post('/posts', function(req, res, next) {
	var post = new Post(req.body);

	post.save(function(err, post){
		if(err){ return next(err); }

		res.json(post);
	});
});

/* GET /posts/:id - return an individual post with associated comments */
router.get('/posts/:post', function(req, res) {
	req.post.populate('comments', function(err, post) {
		res.json(post);
	});
});


/* PUT /posts/:id/upvote - upvote a post, notice we use the post ID in the URL */
router.put('/posts/:post/upvote', function(req, res, next) {
	req.post.upvote(function(err, post){
		if (err) { return next(err); }

		res.json(post);
	});
});


/* POST /posts/:id/comments - add a new comment to a post by ID */
router.post('/posts/:post/comments', function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment){
		if(err){ return next(err); }

		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			if(err){ return next(err); }

			res.json(comment);
		});
	});
});

/* PUT /posts/:id/comments/:id/upvote - upvote a comment */
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
	req.comment.upvote(function(err, post){
		if (err) { return next(err); }

		res.json(post);
	});
});

// Create the :post variable to be used in routes
router.param('post', function(req, res, next, id) {
	var query = Post.findById(id);

	query.exec(function (err, post){
		if (err) { return next(err); }
		if (!post) { return next(new Error("can't find post")); }

		// Attach post to the request object
		req.post = post;
		// move on with the route
		return next();
	});
});

// Create the :comment variable to be used in routes
router.param('comment', function(req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function (err, comment){
		if (err) { return next(err); }
		if (!comment) { return next(new Error("can't find comment")); }

		// Attach comment to the request object
		req.comment = comment;
		// move on with the route
		return next();
	});
});

module.exports = router;
