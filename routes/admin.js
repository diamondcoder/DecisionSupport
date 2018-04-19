var router=require('express').Router();
var Category =require('../models/category');


router.get('/add-category', function(req, res, next){
	res.render('admin/add-category', {message: req.flash('success') });


});
router.get('/dsshome', function(req, res, next){
	res.render('admin/dsshome');


});
router.get('/searchpage', function(req, res, next){
	//if(!myvar) res.render('admin/dsshome');
	res.render('admin/searchpage');


});
router.get('/insights', function(req, res, next){
	res.render('admin/insights');


});
router.post('/add-category', function(req,res, next){
	var category = new Category();
	category.name = req.body.name;

	category.save(function(err){
		if(err) return next(err);
		req.flash('success', 'successfully added a category');
		return res.redirect('/add-category');
	});
})
 module.exports = router;
