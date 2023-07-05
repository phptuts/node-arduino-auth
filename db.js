const { Sequelize } = require("sequelize");
const createUserModel = require("./user.model");

console.log(process.env.DB_CONNECTION, "connection");
const sequelize = new Sequelize(process.env.DB_CONNECTION);

const UserModel = createUserModel(sequelize);

module.exports = { UserModel, sequelize };
