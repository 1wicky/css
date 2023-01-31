//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify }= require('util');

module.exports={
    eAdmin: async function (req, res, next){
        const authHeader = req.headers.authorization;
     //   console.log(authHeader)
     if(!authHeader){
         return res.status(400).json({
             erro: true,
             mensagem: "erro: Necessario realizar login para acessar esta pagina A!"
         })
     }
     const [, token]= authHeader.split(' ');
     console.log(" token: "+token)

     if(!token){
        return res.status(400).json({
            erro: true,
            mensagem: "erro: Necessario realizar login para acessar esta pagina B!"
        })
     }


     try{
         const decode = await promisify(jwt.verify)(token, "shrek2ebom");
        req.Usuarioid = decode.id;
        return next()
     }catch(erro){
        return res.status(400).json({
            erro: true,
            mensagem: "erro: Necessario realizar login para acessar esta pagina B!"})
     }

    }
}