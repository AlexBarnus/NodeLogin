const Sequelize = require('sequelize');
const {models} = require('./models')

const validateLogin = (userName,password) => {
    return new Sequelize.Promise((resolve,reject) => {
        if(typeof userName === "undefined" || userName === "")
            reject(new Error('Falta el parametro <userName>'));
        else if(typeof password === "undefined" || password === "")
            reject(new Error('Falta el parametro <password>'));     
        else
            resolve({userName: userName, password:password});            
    })
}


exports.singUp = (userName,password) => {
    return new Sequelize.Promise((resolve,reject)=> {
    validateLogin(userName,password)
    .then(user => {
        resolve(models.users.findOne({where: {user_name : user.userName, password:user.password}}));
        })
        .catch(err => reject(new Error(err.message)));      
    })      

};

exports.createLoginTrace = (user_id) => {
    return new Sequelize.Promise((resolve,reject)=>{
        resolve(models.logintrace.create({user_id:user_id,date_login:Date.now()}))
        .catch(err => reject(new Error(err.message))); 
    })
         
}


exports.getSessions =(userid) => {
    return new Sequelize.Promise((resolve,reject) => {
        resolve(models.logintrace.findAll({where: {user_id: userid}}));
    })
    .then(logins => {
     
        let dates = [];
        logins.forEach(login => {
             dates.push(login.date_login);
        })
        return dates;
    })
}

 
        
const searchlast = (id) =>{
    return Promise.resolve(models.logintrace.findOne({where: {user_id: id}, order: [['date_login','DESC']]}));
}

const asyncSearch = async id => {
    return await searchlast(id);
}
    
const getSearch = async sessions =>{
    return await Promise.all(sessions.map(item => asyncSearch(item)))
}

  
const getLastLogin = (sessions) => {
return new Sequelize.Promise((resolve, reject) => {
    let ids = []
    sessions.map((data => {
        Jdata = JSON.parse(data);
        if(Jdata.key)
        {
            ids.push(Jdata.key.user_id);
        }


    }))       

    
    getSearch(ids).then(data => {
        let result = [];
        sessions.map((item => {
            Jres = JSON.parse(item);  
            if(Jres.key)
            {
                result.push({usuario: Jres.key.user_name, fecha: data.find(function(el){return Jres.key.user_id == el.user_id;}).createdAt});
            }
        }))
       resolve(result);
    });
})}

 
 exports.getConnected = (client) => {
     return new Sequelize.Promise((resolve,reject) => {
        
         client.keys("sess*", function(error,keys){

            client.mget(keys, (err, sessions)=> {                
                resolve(getLastLogin(sessions));
            });

        })
       
    })
    .catch(err => reject(new Error(err.message)));           
 }
        