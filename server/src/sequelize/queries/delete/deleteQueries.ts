import { Request, Response } from 'express';
import * as types from '../../../types/requests';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { dirname } from 'path';
import url, { fileURLToPath } from 'url';
import { isFormValid } from '../../../middlewares/middlewares';
import models from '../../models/index';
import * as messages from '../../../types/messages';

dotenv.config({ path: '../../../../.env' });

// delete 1 pet by user (user dashboard)
const deleteUserPet = (request: Request, response: Response) => {
	const paramsId: types.RequestGetPetIdParams['id'] = request.params.id;

	const id = Number(paramsId);

	const pet = models.Pet.destroy({
		where: {
			id: id,
		},
	});

	pet
		.then((res) => response.status(200).json({ msg: messages.SUCCESS_MSG_DELETED_PET }))
		.catch((err) => response.status(400).json({ msg: messages.ERROR_MSG_DELETE_PET }));
};

// delete all pets by user (user dashboard)
const deleteAllUserPets = (request: types.RequestUserPets, response: Response) => {
	const userId: types.RequestUserPets['userId'] = request.userId;
	const isAdmin: types.RequestUserPets['isAdmin'] = request.isAdmin;

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

// delete user - delete user and the connected pets (Dashboard)
const deleteUser = (request: types.RequestGetPetUserId, response: Response) => {
	const userId: types.RequestGetPetUserId['userId'] = request.userId;

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

export { deleteUserPet, deleteAllUserPets, deleteUser };
