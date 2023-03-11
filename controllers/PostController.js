import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();
		
		const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

		res.json(tags);
	} catch (error) {
		res.status(500).json({
			message: 'Не найдено тег'
		});
	}
}

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec();

		res.json(posts)
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не вдалося получити статі'
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;

		PostModel.findOneAndUpdate({
			_id: postId,
		}, {
			$inc: { viewsCount: 1}
		}, {
			returnDocument: 'after',
		},
		(error, doc) => {
			if (error) {
				console.log(error);
				return res.status(500).json({
					message: 'Не вдалося створити статю'
				})
			}

			if (!doc) {
				return res.statu(404).json({
					message: 'Статя не найдена'
				});
			}

			res.json(doc);
		}).populate('user');
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не вдалося получити статі'
		})
	}
}

export const remove	 = async (req, res) => {
	try {
		const postId = req.params.id;

		PostModel.findOneAndDelete({
			_id: postId,
		}, (error, doc) => {
			if (error) {
				console.log(error);
			 	res.status(500).json({
					message: 'Не вдалося видалити статю'
				})
			}

			if (!doc) {
				return res.statu(404).json({
					message: 'Статя не найдена'
				});
			}

			res.json({
				success: true
			})
		})

	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не вдалося получити статі'
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags.split(','),
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не вдалося створити статю'
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel.updateOne({
			_id: postId
		}, {
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			user: req.body.userId,
			tags: req.body.tags
		})

		res.json({
			success: true,
		});
	} catch (error) {
		return res.statu(500).json({
			message: 'Не вдалося обновити статю'
		});
	}
}
