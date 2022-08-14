const Sequelize = require('sequelize');
const db = require('../database/db');

const User = db.define('gcardoso_users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    gender: {
        type: Sequelize.STRING(1),
        allowNull: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

//Criar tabela com sequelize 

// User.sync();

//Excluir a tabelae fazer novamente 

// User.sync({force: true});

//Verificar se há alguma diferença NA TABELA, REALIZA ALTERAÇÂO

// User.sync({alter: true});

//cADASTRAR REGISTRO NO BANCO DE DADOS

// User.create({
//     name:"Oliveira",
//     email:"senacsp@gmail.com",
//     gender:"M",
//     password:"123"
// })

module.exports = User;