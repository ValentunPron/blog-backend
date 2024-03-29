import express, { Router } from 'express';
import fs from 'fs'
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation, postCommentsValidation } from './validations.js';

import { UserController, PostController, ActiveController } from './controllers/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

mongoose.set("strictQuery", false);
  
//'mongodb+srv://admin:admin123@cluster0.ovflhbn.mongodb.net/blog?retryWrites=true&w=majority'
//process.env.MONGO_URL
mongoose
	.connect('mongodb+srv://admin:admin123@cluster0.ovflhbn.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err))

const app = express(); 
const router = express.Router();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads')
	}, 
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
	params: {
	  folder: 'my_folder',
	  use_filename: true,
	  unique_filename: false,
	},
});

const upload = multer({ storage });

app.use(express.json()); // Перетворює req в формат json]
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', upload.single('image'), (req, res) => {
	console.log(req.file.originalname);
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});


app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.get('/posts/tags', PostController.getLastTags);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);

app.post('/posts/comments/:id', checkAuth, postCommentsValidation, handleValidationErrors, ActiveController.comments);
app.get('/posts/comments/:id', ActiveController.getComments);

app.post('/:postId/like', checkAuth, ActiveController.like)

app.listen(process.env.PORT || 4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('Server OK');
});