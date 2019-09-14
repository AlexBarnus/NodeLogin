const index = require("../index");
var request = require("request");



const username = "Alex";
const password = "boss";
const urlBase =  "http://localhost:3000/"

 describe('Método del api para controlar login', function() {
    it("Debe permitir realizar login con los datos válidos", async(done) => {

        var dataObj = {'username' : username, 'password' : password};

        request.post({
            url: urlBase + "login",
            body:dataObj,
            json:true
        },function(err,res,body){
                expect(res.statusCode).toBe(200);
                expect(res.body.message).toEqual("Login correcto.");
                done();
        });
    });

    it("Debe devolver login incorrecto cuando los datos no son válidos", async(done) => {

        var dataObj = {'username' : username, 'password' : password + "fake"};

        request.post({
            url: urlBase + "login",
            body:dataObj,
            json:true
        },function(err,res,body){
                expect(res.statusCode).toBe(200);
                expect(res.body.message).toEqual("Usuario o contraseña incorrectos.");
                done();
        });
    });

    it("Debe devolver un error si faltan datos", async(done) => {

        var dataObj = {'username' : username};

        request.post({
            url: urlBase + "login",
            body:dataObj,
            json:true
        },function(err,res,body){
                expect(res.statusCode).toBe(500);
                expect(res.body.message).toContain("Falta el parámetro ");
                done();
        });
    });


}) 

describe("Método para obtener las sesiones de un usuario", function(){
    
    it("Debe devolver status 403 al no estar logado", async(done) => {


          
                request.get(urlBase + "sesions", function(err,res,body){
                    expect(res.statusCode).toBe(403);                
                    done();
                });
          
    });

    


})

describe("Método para obtener los usuarios logados", function(){
    
    it("Debe devolver status 403 al no estar logado", async(done) => {


          
                request.get(urlBase + "users", function(err,res,body){
                    expect(res.statusCode).toBe(403);                
                    done();
                });
          
    });

})

describe("Método para hacer logout", function(){
    
    it("Debe devolver no está logado en estos momentos", async(done) => {
          
                request.get(urlBase + "logout", function(err,res,body){
                    expect(res.statusCode).toBe(200);    
                    expect(res.body).toContain("No está logado en estos momentos.");            
                    done();
                });
          
    });

})