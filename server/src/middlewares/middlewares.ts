import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';

let DEBUG = false;

// function authMw(request: Request, response: Response, next: NextFunction) {
function authMw(request: any, response: Response, next: NextFunction) {
	let token = request.headers['x-auth-token'];

	if (token) {
		jwt.verify(token, 'r4uqSKqC6L', (err: any, decodedToken: any) => {
			if (decodedToken) {
				request.userId = decodedToken.id;
				request.isAdmin = decodedToken.isAdmin;
				next();
			} else {
				response.status(401).json({ msg: 'Token is not valid' });
			}
		});
	} else {
		response.status(401).json({ msg: 'No token found' });
	}
}

function isFormValid(request: Request, response: Response, next: NextFunction) {
	const email = request.body.email;
	const password = request.body.pw;
	const username = request.body.username;
	const phone = request.body.phone;

	const usernameRegex: RegExp = /^[A-Za-z0-9öÖäÄåÅ_\.]*$/;
	const usernameFirstCharacter: RegExp = /^[a-zA-ZöÖäÄåÅ]/;
	const emailRegex: RegExp =
		/^[-!#$%&'.*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
	const phoneRegex: RegExp = /^\d+$/;
	const pwUppercase: RegExp = /^(?=.*[A-Z])/;
	const pwLowercase: RegExp = /^(?=.*[a-z])/;
	const pwDigit: RegExp = /^(?=.*\d)/;
	const pwAllowedSpecialCharacters: RegExp =
		/^(?=.*[§đ½¡”»£¤«“‰„‚\/\\°¿´˛¸€ÞþıŒœ ̛˚˝¯¨əßÐðĸøØÆæ'˘><Ʒʒ·×Ŋŋ—µ,‘’˙–~@#$%^&*+=`|{}:;!.?_\"()\[\]-])/;

	const validByEmailRegex = emailRegex.test(email);
	const emailParts = email.split('@');
	const domainPart = emailParts[1].split('.');
	const isFirstCharacterPassTheTest = usernameFirstCharacter.test(username);
	const validByUsernameRegex = usernameRegex.test(username);
	const validByPhoneRegex = phoneRegex.test(phone);
	const uppercase = pwUppercase.test(password);
	const lowercase = pwLowercase.test(password);
	const digits = pwDigit.test(password);
	const specialChars = pwAllowedSpecialCharacters.test(password);
	let message: string = '';

	if (!username && !phone) {
		// login
		if (!email) {
			message = 'Email is required';
		} else if (!validByEmailRegex) {
			message = 'Email format is not valid';
		} else if (!password) {
			message = 'Password is required';
		}
	} else {
		// signUp
		if (!email) {
			message = 'Email is required';
		} else if (!validByEmailRegex) {
			message = 'Email format is not valid';
		} else if (email.length > 254) {
			message = 'Email length exceeds the maximum';
		} else if (emailParts[0].length > 64) {
			message = 'Email username is too long';
		} else if (
			domainPart.some(function (part: string[]) {
				return part.length > 63;
			})
		) {
			message = 'Email domain is too long';
		} else if (!username) {
			message = 'Username is required';
		} else if (username.length < 2) {
			message = 'Username must contain at least 2 characters';
		} else if (username.length > 29) {
			message = 'Username must be less than 30 characters';
		} else if (!isFirstCharacterPassTheTest) {
			message = 'Username must start with a letter';
		} else if (!validByUsernameRegex) {
			message = 'Username contains invalid characters';
		} else if (!phone) {
			message = 'Phone number is required';
		} else if (!validByPhoneRegex) {
			message = 'Phone number must contain only digits';
		} else if (phone.length < 3) {
			message = 'Phone number is too short (min. 3 digits)';
		} else if (phone.length > 15) {
			message = 'Phone number is too long (max. 15 digits)';
		} else if (!password) {
			message = 'Password field is required';
		} else if (password.length < 8) {
			message = 'Password must contain at least 8 characters';
		} else if (!uppercase) {
			message = 'Password must contain at least one uppercase letter';
		} else if (!lowercase) {
			message = 'Password must contain at least one lowercase letter';
		} else if (!digits) {
			message = 'Password must contain at least one digit';
		} else if (!specialChars) {
			message = 'Password must contain at least one special character';
		}
	}

	if (message != '') {
		return response.status(400).json({ msg: message });
	} else {
		next();
	}
}

const upload = multer();

export { authMw, isFormValid, upload };
