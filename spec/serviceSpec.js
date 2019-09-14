const service = require("../service");

const userId = 1;
const fakeUserId = 0;
const username = "Alex";
const password = "boss";


describe("Método de login", function() {
    it("Debe validar que venga username",async(done) => {

        let promise = service.singUp("",password);

        promise.then(function(){
            done.fail(new Error('La promesa no debería ser resuelta'));

        }).catch(err => {
            expect(err.message).toEqual("Falta el parámetro <userName>");
            done();
        })
            
    });
    it("Debe validar que venga password", async(done) => {
        let promise = service.singUp(username,"");

        promise.then(function(){
            done.fail(new Error('La promesa no debería ser resuelta'));

        }).catch(err => {
            expect(err.message).toEqual("Falta el parámetro <password>");
            done();
        })
    });
    it("Debe devolver usuario si los datos son correctos", async() => {
        let promise =  await service.singUp(username,password);
        expect(promise).toBeTruthy();
        
    });
    it("Debe devolver usuario vacío si los datos no son correctos", async() => {

        let promise = await service.singUp(username,password + "fake");
        expect(promise).toBeNull();
    });
})

describe("Método para crear la traza del login", function() {
    it("Debe crear y devolver la traza del login", async() => {

        let promise = await service.createLoginTrace(userId);
        expect(promise).toBeTruthy();
    });
    it("Debe lanzar un error si no puede crear la traza", async(done) => {
        let promise =  service.createLoginTrace();
        promise.then(function(){
            done.fail(new Error('La promesa no debería ser resuelta'));
        }).catch(err => {
            done();
        })
    })
})

describe("Método que obtiene las sesiones de un usuario", function() {
    it("Debe devolver un listado de conexiones del usuario", async() =>{
        let promise = await service.getSessions(userId);
        expect(promise.length).toBeGreaterThan(0);
    });
    it("Debe devolver un listado de vacío conexiones del usuario si no existe", async() =>{
        let promise = await service.getSessions(fakeUserId);
        expect(promise.length).toEqual(0);
    });
    it("Debe lanzar un error si no puede obtener los datos", async(done) => {
        let promise =  service.getSessions();
        promise.then(function(){
            done.fail(new Error('La promesa no debería ser resuelta'));
        }).catch(err => {
            done();
        })
    })
})

describe("Método para obtener los usuarios conectados y su última fecha de conexión", function() {

    fakeSession = () => {
        const redis = require('redis')
        const session = require('express-session')
        const express = require('express')
        const RedisStore = require('connect-redis')(session)
        const cookieParser  =  require('cookie-parser');

        var client = redis.createClient({
            host: 'localhost',
            port: 6379,
            ttl : 10  
          })

        var store = new RedisStore({ client })
        var app = express();
        app.use(session({
            secret: '123456',
            resave: false,
            saveUninitialized: true,
            cookie : {
              maxAge : 60000 * 100 //GOTO cambiar a 7 horas
            },
            store: store
          }))
        client.set('sess:fakeSession',"{\"cookie\":{\"originalMaxAge\":6000000,\"expires\":\"2019-09-14T16:58:59.277Z\",\"httpOnly\":true,\"path\":\"/\"},\"key\":{\"user_id\":1,\"user_name\":\""+username+"\",\"password\":\"boss\",\"gerente\":true,\"createdAt\":\"2019-09-13T09:17:13.000Z\",\"updatedAt\":\"2019-09-13T09:17:13.000Z\"}}","EX",1000);

        return client;
    }

    it("Debe devolver un listado de usuarios y fechas de última conexión de los usuarios conectados", async() => {
        let client = fakeSession();        
        let promise = await service.getConnected(client);
        expect(promise[0].usuario).toEqual(username);

    });

    if("Debe devolver un error en caso de que no pueda recuperar los datos", async(done) => {
                
        promise.then(function(){
            done.fail(new Error('La promesa no debería ser resuelta'));
        }).catch(err => {
            done(err);
        });
    });

});



