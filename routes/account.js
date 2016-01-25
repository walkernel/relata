var express = require('express');
var passport     = require('passport');
var mongoose     = require('mongoose');
var accountModel = require('../models/account');

var router = express.Router();


/* GET users listing. */
router.get('/register', function (req, res){
	res.render('register', {});
});

router.post('/register', function(req, res) {
	if(req.body.password2===req.body.password) {
		accountModel.register( new accountModel( { username : req.body.username } ), req.body.password,
			function ( err, account ){
				if( err ) {
					return res.render( "error", { info : "Sorry. That username already exists. Try again." } );
				}
				passport.authenticate( 'local' )( req, res, function (){
					res.redirect( '/schema' );
				} );
			} );
	}else{
		return res.render("error", {info: "Sorry, your passwords do not match, please try again"})
	}
});

router.get('/login', function (req, res){
	res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function (req, res){
	res.redirect('/search');
});

router.get('/logout', function (req, res){
	req.logout();
	res.redirect('/');
});


module.exports = router;
