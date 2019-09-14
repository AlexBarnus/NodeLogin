
'use strict';
const redis = require('redis')
const session = require('express-session')
const http = require('http')
const bodyParser = require('body-parser')
const express = require('express')
const RedisStore = require('connect-redis')(session)
const cookieParser  =  require('cookie-parser');
const request = require("request");
const Config = require('./config/config');


const {models} = require('./models');
const service = require('./service');

var client = redis.createClient({
  host: Config.redis.host,
  port: Config.redis.post,
  ttl : Config.redis.ttl
})


client.on('error', console.log)

var store = new RedisStore({ client })

var app = express();
app.use(cookieParser(Config.cookie.claveSecreta));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.set('port', Config.express.port); 
app.disable('x-powered-by');

app.set('trust proxy', 1) 
app.use(session({
  secret:Config.express.secret,
  resave: Config.express.resave,
  saveUninitialized: Config.express.saveUninitialized,
  cookie : {
    maxAge : Config.express.maxAge
  },
  store: store
}))


app.get('/', (req, res) => {
    res.status(200).json({"error":false,"message":"Bienvenido a la API de Hoonter Test, use /Login para logarse."});
  })

app.post('/login',(req,res) => {
   service.singUp(req.body.username,req.body.password)
   .then((user => {
    if(!user)
        {
            res.status(200).json({"error":false,"message":"Usuario o contraseña incorrectos."});
       
        }
        else
        {
            service.createLoginTrace(user.user_id)
            .then(() => {
                req.session.key = user;                
                res.status(200).json({"error":false,"message":"Login correcto."});
            })            
        
        }
   }))
   .catch( err => {res.status(500).json({"error":true,"message":err.message})});

});

app.get('/sesions',(req,res) => {
    try {
        if(req.session.key)
        {
            service.getSessions(req.session.key.user_id)
            .then(logins => {   
                res.status(200).json({logins});
            })
            .catch( err => {res.status(500).json({"error":true,"message":err.message})});
        }
        else
        {
            throw "No tiene permisos para realizar esta acción";
            
        }
    } catch(excepcion) {
        res.status(403).send(excepcion);       
    }


});

app.get('/users',(req,res) => {
    try{
        if(req.session.key && req.session.key.gerente)
            {       
        
                service.getConnected(client)
                .then(result => {
                res.json(result);
            })
            .catch( err => {res.status(500).json({"error":true,"message":err.message})});
        
            }
            else
            throw "No tiene permisos para realizar esta acción";           

    }
    catch(excepcion)
    {
        res.status(403).send(excepcion);   
    }
   
    
})

app.get('/logout',(req,res) => {
    if(req.session.key)
    {
        req.session.destroy(function(err){
            if(err){
                res.status(500).json({"error":true,"message":err.message})
            } else {
               res.status(200).json("Logout realizado");
            }
        });

    }
    else
    res.status(200).json("No esta logado en estos momentos.");
    
})

  
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Hoonter Test Api en puerto : ' + app.get('port'));
});

