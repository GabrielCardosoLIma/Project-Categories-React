const Sequelize = require('sequelize');
const db = require('../database/db');

const Categories = db.define('gcardoso_categories', {
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
    description: {
        type: Sequelize.STRING,
        allowNull: true,
    }
})

//Criar tabela com sequelize 

// Categories.sync();

//Excluir a tabelae fazer novamente 

// Categories.sync({force: true});

//Verificar se há alguma diferença NA TABELA, REALIZA ALTERAÇÂO

// Categories.sync({alter: true});

//cADASTRAR REGISTRO NO BANCO DE DADOS

// Categories.create({
//     name:"Oliveira",
//     email:"senacsp@gmail.com",
//     gender:"M",
//     password:"123"
// })

module.exports = Categories;