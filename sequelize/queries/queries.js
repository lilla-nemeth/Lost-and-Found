import pg from 'pg';
import * as messages from '../../types/messageTypes.js';
import * as queries from '../../types/queryTypes.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { dirname } from 'path';
import url from 'url';
import { fileURLToPath } from 'url';
import models from '../models/index.js';
import { isFormValid } from '../../middlewares.js';

dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));
}

///////////////////////////////////////////////////////////////////////////////////

// WITH SEQUELIZE:

const createUserAccount = (request, response) => {
	const username = request.body.username;
	const email = request.body.email;
	const pw = request.body.pw;
	const phone = request.body.phone;
	const encryptedPw = bcrypt.hashSync(pw, 10);

	const user = models.User.create({
		username,
		email,
		pw: encryptedPw,
		phone,
		isAdmin: false,
	});

	user
		.then((data) => {
			response.status(200).json(data.save());
		})
		.catch((err) => {
			if (err.code === '23505' && err.constraint === 'users_email_key') {
				response.status(400).json({ msg: messages.ERROR_MSG_USED_EMAIL });
			} else if (err.code === '23505' && err.constraint === 'users_phone_key') {
				response.status(400).json({ msg: messages.ERROR_MSG_USED_PHONE });
			} else if (err.code != '23505' && isFormValid) {
				isFormValid;
			}
		});
};

// get all users
// TODO: works, but useless, instead getPetsByPagination should have another query to get user data from users
const getAllUsers = (request, response) => {
	const users = models.User.findAll();

	users
		.then((data) => {
			response.status(200).json(data);
		})
		.catch((err) => {
			response.status(400).json({ msg: messages.ERROR_MSG_FETCH_USERS });
		});
};

// get/fetch limited amount of pets to pagination
// TODO: this getPetsByPagination could be combined with getTotalNumberOfPets
const getPetsByPagination = (request, response) => {
	const offset = request.params.skip;
	const limit = request.params.fetch;

	const pets = models.Pet.findAndCountAll({
		order: [['since', 'DESC']],
		offset,
		limit,
	});
	pets
		.then((data) => {
			response.status(200).json(data.rows);
		})
		.catch((err) => {
			console.log(err);
			response.status(400).json({ msg: messages.ERROR_MSG_FETCH_PETS });
		});
};

// get the total amount (number) of pets
const getTotalNumberOfPets = (request, response) => {
	const offset = request.params.skip;
	const limit = request.params.fetch;

	const pets = models.Pet.findAndCountAll({
		order: [['since', 'DESC']],
		offset,
		limit,
	});
	pets
		.then((data) => {
			response.status(200).json(data.count);
		})
		.catch((err) => {
			response.status(400).json({ msg: messages.ERROR_MSG_FETCH_TOTAL_PETS });
		});
};

// report pet by user
const createPetProfile = (request, response) => {
	const userId = request.userId;
	const img = request.file.buffer.toString('base64');
	const petstatus = request.body.petstatus;
	const petlocation = request.body.petlocation;
	const longitude = request.body.longitude;
	const latitude = request.body.latitude;
	const species = request.body.species;
	const petsize = request.body.petsize;
	const breed = request.body.breed;
	const sex = request.body.sex;
	const color = request.body.color;
	const age = request.body.age;
	const uniquefeature = request.body.uniquefeature;
	const postdescription = request.body.postdescription;

	const pet = models.Pet.create({
		userId,
		img,
		petstatus,
		petlocation,
		longitude,
		latitude,
		species,
		petsize,
		breed,
		sex,
		color,
		age,
		uniquefeature,
		postdescription,
	});

	pet
		.then((data) => {
			response.status(200).json(data.save());
		})
		.catch((err) => {
			response.status(400).json({ msg: messages.ERROR_MSG_CREATE_PET });
		});
};

// NOTE: UNUSED
// from pets table get one pet by id
const getPetById = (request, response) => {
	const id = request.params.id;

	const pet = models.Pet.findByPk(id);

	pet
		.then((data) => {
			response.status(200).json(data.rows);
		})
		.catch((err) => {
			response.status(400).json({ msg: messages.ERROR_MSG_FETCH_USER_PETS });
		});
};

// get all pets by userId
const getAllUserPets = (request, response) => {
	const userId = request.userId;
	const isAdmin = request.isAdmin;

	const userPetList = models.Pet.findAll({
		order: [['since', 'DESC']],
		where: {
			userId,
		},
	});

	const adminPetList = models.Pet.findAll({
		order: [['since', 'DESC']],
	});

	if (isAdmin) {
		adminPetList
			.then((data) => {
				response.status(200).json(data);
			})
			.catch((err) => {
				response.status(400).json({ msg: messages.ERROR_MSG_FETCH_USER_PETS });
			});
	} else {
		userPetList
			.then((data) => {
				response.status(200).json(data);
			})
			.catch((err) => {
				response.status(400).json({ msg: messages.ERROR_MSG_FETCH_USER_PETS });
			});
	}
};

// NOTE: currently unused on the client side
// edit pet by user (user dashboard)
const updatePet = (request, response) => {
	const id = request.params.id;
	const petstatus = request.body.petstatus;
	const petlocation = request.body.petlocation;
	const longitude = request.body.longitude;
	const latitude = request.body.latitude;
	const species = request.body.species;
	const petsize = request.body.petsize;
	const breed = request.body.breed;
	const sex = request.body.sex;
	const color = request.body.color;
	const age = request.body.age;
	const uniquefeature = request.body.uniquefeature;
	const postdescription = request.body.postdescription;

	const pet = models.Pet.update({
		id,
		petstatus,
		petlocation,
		longitude,
		latitude,
		species,
		petsize,
		breed,
		sex,
		color,
		age,
		uniquefeature,
		postdescription,
	});

	pet
		.then((res) => response.status(200).json({ msg: messages.SUCCESS_MSG_UPDATED_PET }))
		.catch((err) => response.status(400).json({ msg: messages.ERROR_MSG_FETCH_USERERROR_MSG_UPDATE_PET }));
};

// NOTE: currently unused on the client side
// edit user data (user dashboard)
const updateUser = (request, response) => {
	const id = request.userId;
	const username = request.body.username;
	const email = request.body.email;
	const pw = request.body.pw;
	const phone = request.body.phone;
	const encryptedPw = bcrypt.hashSync(pw, 10);

	const user = models.User.update(
		{
			username,
			email,
			pw: encryptedPw,
			phone,
		},
		{
			where: {
				id,
			},
		}
	);
	user
		.query(queries.UPDATE_USER, [username, email, encryptedPw, phone, id])
		.then((res) => response.status(200).json({ msg: messages.SUCCESS_MSG_UPDATED_USER }))
		.catch((err) => response.status(400).json({ msg: messages.ERROR_MSG_UPDATE_USER }));
};

// delete 1 pet by user (user dashboard)
const deleteUserPet = (request, response) => {
	const id = request.params.id;

	const pet = models.Pet.destroy({
		where: {
			id,
		},
	});

	pet
		.then((res) => response.status(200).json({ msg: messages.SUCCESS_MSG_DELETED_PET }))
		.catch((err) => response.status(400).json({ msg: messages.ERROR_MSG_DELETE_PET }));
};

// delete all pets by user (user dashboard)
const deleteAllUserPets = (request, response) => {
	const userId = request.userId;
	const isAdmin = request.isAdmin;

	const userPetList = models.Pet.destroy({
		truncate: true,
		where: {
			userId,
		},
	});

	const adminPetList = models.Pet.destroy({ truncate: true });

	if (isAdmin) {
		adminPetList
			.then((res) => response.status(200).json({ msg: messages.SUCCESS_MSG_DELETED_PETS }))
			.catch((err) => response.status(400).json({ msg: messages.ERROR_MSG_DELETE_PETS }));
	} else {
		userPetList
			.then((res) => response.status(200).json({ msg: messages.SUCCESS_MSG_DELETED_PETS }))
			.catch((err) => response.status(400).json({ msg: messages.ERROR_MSG_DELETE_PETS }));
	}
};

// delete user - delete user and the connected pets (user dashboard)
const deleteUser = (request, response) => {
	const userId = request.userId;

	const pet = models.Pet.destroy({
		where: {
			userId,
		},
	});

	const user = models.User.destroy({
		where: {
			id: userId,
		},
	});

	pet
		.then((res) => {
			user
				.then((res) => {
					response.status(200).json({
						msg: messages.SUCCESS_MSG_DELETED_USER_AND_PETS,
					});
				})
				.catch((err) => {
					response.status(400).json({ msg: messages.ERROR_MSG_DELETE_USER });
				});
		})
		.catch((err) => {
			response.status(400).json({ msg: messages.ERROR_MSG_DELETE_PETS });
		});
};

// search pet location
const getGeocodeLocation = (request, response) => {
	const query = request.params.query;
	const params = new URLSearchParams({
		access_token: process.env.API_KEY,
		...url.parse(request.url, true).query,
	});
	const result = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params}`;

	axios
		.get(result)
		.then((res) => {
			response.status(200).json(res.data);
		})
		.catch((err) => {
			response.status(500).json({ error: err.message });
		});
};

///////////////////////////////////////////////////////////////////////////////////

const devSettings = {
	host: process.env.PG_HOST,
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT,
	database: process.env.PG_DATABASE,
};

const prodSettings = {
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: process.env.NODE_ENV === 'production' ? false : true,
	},
};

const pool = new Pool(process.env.NODE_ENV === 'production' ? prodSettings : devSettings);

// get username
const getUsername = (request, response) => {
	const id = request.userId;

	pool
		.query(queries.SELECT_USER_BY_ID, [id])
		.then((res) => response.status(200).json(res.rows[0].username))
		.catch((err) => response.status(400).json({ msg: messages.ERROR_MSG_FETCH_USERNAME }));
};

// const getUsername = (request, response) => {
// 	const userId = request.userId;

// 	const user = models.User.findByPk(userId);
// 	console.log(user);
// 	// console.log(userId);

// 	// const user = models.User.findOne({
// 	// 	where: {
// 	// 		id: userId,
// 	// 	},
// 	// });

// 	// const user = models.User.findByPk(userId);

// 	user
// 		.then((data) => {
// 			// response.status(200).json(data);
// 			// console.log(data[0]);
// 		})
// 		.catch((err) => {
// 			response.status(400).json({ msg: messages.ERROR_MSG_FETCH_USERNAME });
// 		});
// };

const signIn = (request, response) => {
	const email = request.body.email;
	const pw = request.body.pw;

	pool
		.query(queries.SELECT_USER_BY_EMAIL, [email])
		.then((res) => {
			const userObject = res.rows[0];
			const encryptedPw = userObject.pw;

			res.rows &&
				bcrypt.compare(pw, encryptedPw).then((isMatch) => {
					if (isMatch) {
						jwt.sign({ id: userObject.id, isAdmin: userObject.isAdmin }, 'r4uqSKqC6L', (err, token) => {
							response.status(200).json(token);
						});
					} else {
						response.status(403).json({ msg: messages.ERROR_MSG_INCORRECT_PASSWORD });
					}
				});
		})
		.catch((err) => response.status(400).json({ msg: messages.ERROR_MSG_NOT_FOUND_USER }));
};

const getAll = (request, response) => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	response.sendFile(path.join(__dirname, 'client/build/index.html'));
};

export {
	getAllUserPets,
	getPetsByPagination,
	getTotalNumberOfPets,
	getPetById,
	getUsername,
	getAllUsers,
	getGeocodeLocation,
	updatePet,
	updateUser,
	deleteUserPet,
	deleteAllUserPets,
	deleteUser,
	createUserAccount,
	signIn,
	createPetProfile,
	getAll,
};
