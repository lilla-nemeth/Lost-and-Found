import { Router } from 'express';
import { authMw } from '../middlewares.js';
import * as queries from '../sequelize/queries/queries.js';

const router = Router();

router.get('/', authMw, queries.getAllUserPets);
router.delete('/pet/:id', authMw, queries.deleteUserPet);
router.delete('/pet', authMw, queries.deleteAllUserPets);
router.put('/pet/:id', authMw, queries.updatePetData);

export default router;
