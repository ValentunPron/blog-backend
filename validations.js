import { body } from 'express-validator';

export const loginValidation = [
	body('email', "Неправильний формат почти").isEmail(),
	body('password', "Пароль повинен містити мінімум 5 символів").isLength({min: 5}),
];

export const registerValidation = [
	body('email', "Неправильний формат почти").isEmail(),
	body('password', "Пароль повинен містити мінімум 5 символів").isLength({min: 5}),
	body('fullName', "Ім'я повинно містити мінімум 3 символа").isLength({min: 3}),
	body('avatarUrl', "Нерпавильне посилання на аватар").optional().isURL(),
];

export const postCreateValidation = [
	body('title', 'Введіть заголовок статі').isLength({min: 3}).isString(),
	body('text', 'Введіть текст статі').isLength({min: 3}).isString(),
	body('tags', 'Нарпавильний формат тегів').optional().isString(),
	body('imageUrl', 'Неправильна силка на фотографію').optional().isString(),
];

export const postCommentsValidation = [
	body('comments', 'Введіть коментар статі').isLength({min: 3}).isString(),
];