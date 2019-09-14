const mysql = require('mysql');
const Sequelize = require('sequelize');
const Config = require('./config/config');

const sequelize = new Sequelize(Config.sequelize.dataBase, Config.sequelize.user, Config.sequelize.password, {
    host: Config.sequelize.host,
    dialect: Config.sequelize.dialect, 
    logging:Config.sequelize.logging
  });

sequelize.define('users',{
    user_id : { type : Sequelize.INTEGER, allowNull: false, unique:true, autoIncrement: true, primaryKey:true},
    user_name : { type : Sequelize.TEXT, allowNull: false},
    password : { type : Sequelize.TEXT, allowNull: false},
    gerente: {type : Sequelize.BOOLEAN, allowNull: false}
    
})

sequelize.define('logintrace',{
    trace_id : { type : Sequelize.INTEGER, allowNull: false, unique:true, autoIncrement: true, primaryKey:true},
    user_id : {type: Sequelize.INTEGER, allowNull: false},            
    date_login:{ type : Sequelize.DATE, allowNull: false}
})

sequelize.sync()
.then(() => sequelize.models.users.count())
.then(count => {    
  if (!count) {
     return sequelize.models.users.bulkCreate([
        {user_name:"Alex", password: "boss",gerente: true},
        {user_name:"Antonio", password: "123456",gerente: false},
        {user_name:"Sara", password: "qwerty",gerente: false},
        {user_name:"Carla", password: "muelas",gerente: false},
     ]);
  } 
})
.catch( err => console.log(`   ${err}`));



  module.exports = sequelize;