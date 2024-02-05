import sequelize from '../config/config.js';
import { DataTypes } from 'sequelize';

const Pet = sequelize.define('pet', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	userid: {
		type: DataTypes.INTEGER,
	},
	img: DataTypes.TEXT,
	petstatus: DataTypes.STRING,
	longitude: DataTypes.STRING,
	latitude: DataTypes.STRING,
	petlocation: DataTypes.STRING,
	species: DataTypes.STRING,
	petsize: DataTypes.STRING,
	breed: DataTypes.STRING,
	sex: DataTypes.STRING,
	color: DataTypes.STRING,
	age: DataTypes.STRING,
	uniquefeature: DataTypes.STRING,
	postdescription: DataTypes.STRING,
	since: {
		type: DataTypes.DATE,
	},
});

export default Pet;
