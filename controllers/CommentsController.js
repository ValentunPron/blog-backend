import PostModel from '../models/Post.js'
import UserModel from '../models/User.js';

export const comments = async (req, res) => {
	try {
		const postId = req.params.id;

		const post = await PostModel.findById(postId);
		const user = await UserModel.findById(req.userId);

		post.comments.push({
		  comments: req.body.comments,
		  user: user
		});
	  
		await post.save();
	  
		res.json({
		  success: true,
		  post: post
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не вдалося написати коментарі'
		})
	}
}

export const getComments = async (req, res) => {
	try {
		const postId = req.params.id;

	const comments = await PostModel.findById(postId)
		res.json({comments: comments.comments});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не вдалося получити статі'
		})
	}
}
