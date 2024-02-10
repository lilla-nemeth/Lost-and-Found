import { Router } from 'express';
import { isFormValid } from '../middlewares/middlewares';
import * as createQueries from '../sequelize/queries/createQueries';

const router = Router();

router.post('/', [isFormValid], createQueries.createUserAccount);

export default router;
