const Sequelize = require('sequelize');
const db = require('../database/db');

const User = db.define('gcardoso_users_img',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true,
    }
});

//Criar a tabela
// User.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// User.sync({ alter: true });

module.exports = User;