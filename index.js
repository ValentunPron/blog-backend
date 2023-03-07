import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';


import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { UserController, PostController } from './controllers/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

mongoose
	.connect("mongodb+srv://admin:admin123@cluster0.ovflhbn.mongodb.net/blog?retryWrites=true&w=majority")
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err))

const app = express(); 

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	}, 
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
});

const upload = multer({ storage });

app.use(express.json()); // Перетворює req в формат json
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
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	
	console.log('Server OK');
});