import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
const Recipe = require('../models').Recipe
const User = require('../models').User
const Comment = require('../models').Comment
const Favorite = require('../models').Favorite
const Votes = require('../models').Votes

const router = express.Router();  


router.post('/', (req, res) => { //-----------------------------create recipe!
	let decoded = jwt.decode(req.query.token);
	    if (!decoded) {
	        return res.status(401).send({
	            message: 'you have to be logged in to create recipe',
	        });
	    }
        Recipe.create({ 
        	title:req.body.title,
      		category: req.body.category,
      		description:req.body.description,
      		userId: decoded.user.id,  
      	})
        .then(todo => res.status(201).send(todo))
        .catch(error => res.status(400).send(error.toString()))
    } 
);

router.post('/:id/fav', (req, res) => { //-------------------------add recipe to fav and update recipe! 
	let decoded = jwt.decode(req.query.token);
	    if (!decoded) {
	        return res.status(401).send({
	            message: 'you have to be logged in to create recipe',
	        });
	    }
    	Favorite.findOne({
	    	where:{
	    		recipeId:req.params.id,
	    		userId:decoded.user.id
	    	}
        })
        .then(success => {
	        if (!success){
	        	Favorite.create({
	        		recipeId: req.params.id,
	        		userId: decoded.user.id,
	        		categoryId: 1
	        	})
	        	.then(favRecipe => res.status(201).send(favRecipe))
	        	.catch(error => res.status(400).send(error.toString()))
	        }
        	success.destroy()
        	.then(fav => res.status(201).send({message:'recipe unfavorited'}))
        	.catch(error => res.status(400).send(error))
		})
		.catch(error => res.status(400).send(error))
     
}); 

router.get('/:id/favrec', (req, res) => { //-------------------------#
	let decoded = jwt.decode(req.query.token);
	    if (!decoded) {
	        return res.status(401).send({
	            message: 'you have to be logged in to create recipe',
	        });
	    }
	    Recipe.findById(req.params.id, {
	    	include: [{
		        model: Favorite,
		        as: 'favorites'
		    }]
	    })
        .then(recipe => res.status(200).send(recipe))
		.catch(error => res.status(400).send(error.toString()))
     
});



router.put('/:id', (req, res) => { //------------------------send email if user's fav recipe gets updated
	let decoded = jwt.decode(req.query.token);
	    Recipe.findById(req.params.id)
	    .then(recipe => {
	        if (!recipe) {
		        return res.status(404).send({
		            message: 'recipe Not Found',
		        });
	        }
	        if (recipe.userId !== decoded.user.id) {
	            return res.status(401).json({
	                message: 'Unauthorization error'
	            });
	        }
		    return recipe
		        .update({
		            title: req.body.title || recipe.title,
		            description: req.body.description || recipe.description,
		            category: req.body.category || todo.category,    //chinese
		            upvote:req.body.upvote || recipe.upvote, 
		      		downvote:req.body.downvote || recipe.downvote,
		      		userId: decoded.user.id || recipe.user
		      		// favorite: req.body.fav
		        })
		        .then( success => {
		        	console.log(success.favUser[0])
		        	if(success.favUser.length > 1){
		        		const transporter = nodemailer.createTransport({
								service: 'Gmail',
								auth:{
									user:'iykay33@gmail.com',
									pass:'p3nn1s01'
								}
							})
		        		for(let x of success.favUser){
							const mailOptions = {
								from: 'iykay33@gmail.com',
								to: x,
								subject: 'Email example2',
								text: 'Hello User,your favorite recipe has been updated'
							};
							transporter.sendMail(mailOptions,(err,info) => {
								if(err){
									console.log('hiiiii err ' + err)
								}else{
									res.json({
										message: info.response
									})
									console.log('Message sent: ' + info.response)
								}
							})
						}					
						res.status(201).send(success)
		        	}
		        	res.status(201).send(success)
		        })
		        .catch((error) => res.status(400).send(error));
	    })
	    .catch(error => res.status(400).send(error));
    }  //------------------------checked
);

router.post('/:id/review', (req, res) => { //---------------------add review and alert owner of recipe
	Recipe.findById(req.params.id)
	    .then(recipe => {
	    	User.findById(recipe.userId)
	    		.then(user => {
			        Comment.create({ 
			        	recipeId: req.params.id,
			      		content: req.body.content,
			      		email: req.body.email,
			      		occupation: req.body.occupation
			      	})
			        .then(success => {
						const transporter = nodemailer.createTransport({
							service: 'Gmail',
							auth:{
								user:'iykay33@gmail.com',
								pass:'p3nn1s01'
							}
						})
						const mailOptions = {
							from: 'iykay33@gmail.com',
							to: user.email,
							subject: 'Recipe Review',
							text: 'Hello there,youre recipe just got a review! '
						};
						transporter.sendMail(mailOptions,(err,info) => {
							if(err){
								console.log(err)
							}else{
								res.json({
									message: info.response
								})
								console.log('Message sent: ' + info.response)
							}
						})
						res.status(201).send({message:'review sent!'})

			        })
			        .catch(error => res.status(400).send(error))
			    })
			    .catch(error => res.status(400).send(error))
		})
		.catch(error => res.status(400).send(error))
    } 
);
router.post('/:id/reply', (req, res) => { //---------------------review reply
    Comment.create({ 
    	recipeId: req.params.id,
  		content: req.body.content,
  		email: decoded.user.email,
  		occupation: req.body.occupation
  	})
    .then(review => {
		Comment.findById(req.params.id)
			.then(comment => {
				comment.update({
					reply: comment.reply.concat([review]) 
				})
				res.status(201).send(comment)
			})
			.catch(error => res.status(400).send(error.toString()))
		})
    .catch(error => res.status(400).send(error))
});


router.delete('/:id', (req, res) => { //-------------------- delete recipe
	let decoded = jwt.decode(req.query.token);
	    Recipe.findById(req.params.id)
	    .then(recipe => {
	        if (!recipe) {
		        return res.status(404).send({
		            message: 'recipe Not Found',
		        });
	        }
	        if (recipe.user != decoded.user.id) {
	            return res.status(401).json({
	                message: 'Not Authenticated'
	            });
	        }
		    return recipe
		        .destroy()
		        .then(() => res.status(204).send({
		        	message:'recipe deleted!'
		        }))  // Send back the updated todo.
		        .catch((error) => res.status(400).send(error));
	    })
	    .catch(error => res.status(400).send(error));
    }   
);


router.get('/', (req, res) => {  //------------------all recipes
	const decoded = jwt.decode(req.query.token);
	    Recipe.findAll()
	    .then(recipe => res.status(200).send(recipe))
	    .catch(error => res.status(400).send(error));
    } 
);

router.get('/:id/upvote', (req, res) => {  //------------------upvotes#####
	const decoded = jwt.decode(req.query.token);
	Votes.findOne({
		where: {
			recipeId:req.params.id,
			userId:decoded.user.id
		}
	})
	.then(votes => {
		if(!votes){
			Votes.create({
				recipeId:req.params.id,
				userId:decoded.user.id,
				votes:true
			})
			.then(success => {
				Votes.findAndCountAll({
					where:{
						recipeId:req.params.id,
					}
				})
				.then(count => res.status(201).send({
					message:'upvote added',
					upvotes: count.count
				}))
				.catch(error => res.status(401).send(error))
			})
			.catch(error => res.status(401).send(error))
		}
		votes
		.destroy()
			.then(success => {
				Votes.findAndCountAll({
					where:{
						recipeId:req.params.id,
					}
				})
				.then(count => res.status(201).send({
					message:'upvote removed',
					upvotes: count.count
				}))
				.catch(error => res.status(401).send(error))
			})
			.catch(error => res.status(401).send(error))
	})
})

router.get('/:id/downvote', (req, res) => {  //------------------downvotes#####
	const decoded = jwt.decode(req.query.token);
	Votes.findOne({
		where: {
			recipeId:req.params.id,
			userId:decoded.user.id
		}
	})
	.then(votes => {
		if(!votes){
			Votes.create({
				recipeId:req.params.id,
				userId:decoded.user.id,
				votes:false
			})
			.then(success => {
				Votes.findAndCountAll({
					where:{
						recipeId:req.params.id,
					}
				})
				.then(count => res.status(201).send({
					message:'downvote added',
					downvotes: count.count
				}))
				.catch(error => res.status(401).send(error))
			})
			.catch(error => res.status(401).send(error))
		}
		votes
		.destroy()
			.then(success => {
				Votes.findAndCountAll({
					where:{
						recipeId:req.params.id,
					}
				})
				.then(count => res.status(201).send({
					message:'downvote removed',
					downvotes: count.count
				}))
				.catch(error => res.status(401).send(error))
			})
			.catch(error => res.status(401).send(error))
	})
})



module.exports = router;