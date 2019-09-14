const model = require("../models");

describe("Clase que define las tablas y los modelos de base de datos", function(){
    it("Al iniciarse debe crear las tablas en base de datos", async() =>{

     let promise = await model.query('show tables');
       
        expect(JSON.stringify(promise)).toContain("users")
        expect(JSON.stringify(promise)).toContain("logintraces")       
        

    });

    it("Al iniciarse debe añadir los usuarios de prueba", async() => {
        let promise = await model.query("Select count(user_id) from users;")
        
        expect(promise[0][0]['count(user_id)']).toBeGreaterThanOrEqual(4);
    })
})