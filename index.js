import express from 'express';
import fs from 'fs'
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';


import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { UserController, PostController } from './controllers/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

mongoose.set("strictQuery", false);
//'mongodb+srv://admin:admin123@cluster0.ovflhbn.mongodb.net/blog?retryWrites=true&w=majority'
//process.env.MONGO_URL
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err))

const app = express(); 

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
});

const upload = multer({ storage });

app.use(express.json()); // Перетворює req в формат json]
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', upload.single('image'), (req, res) => {
	res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.set('Pragma', 'no-cache');
	res.set('Expires', '0');

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

app.listen(process.env.PORT || 4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('Server OK');
});