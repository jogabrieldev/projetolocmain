import {modelsAuthenticateUser} from "../model/dataAuth.js"
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY

export const authSystemValidade = {

  // Login para funcionário
  async AuthLoginCenter(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password ) {
        return res.status(400).json({ message: "Usuário e senha obrigatórios" });
      }

         const user = await modelsAuthenticateUser.authenticateLogin(username, password);
         console.log('usuario' , user)
      
      if (!user) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      const idUserMain = user.empCode
      if(!idUserMain){
         return res.status(400).json({message:'O id não foi encontrado'})
      }

      const token = jwt.sign(
        { user: user.username, id: user.empCode, tipo: "main" },
        secretKey,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ token, tipo:"main", user:idUserMain });

    } catch (error) {
      console.error("Erro no login do funcionário:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // Login para motorista
  async loginMotorista(req, res) {
    try {
      const { username, password  } = req.body;

      console.log(" corpo" , req.body)

      if (!username || !password) {
        return res.status(400).json({ message: "Usuário e senha obrigatórios" });
      }
         
     
      const motorista = await modelsAuthenticateUser.authDriver(username, password);

      if (!motorista) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      const idMoto = motorista.motocode ;
       
      if(!idMoto){
        return res.status(400).json({message: 'Id do motorista não encontrado'})
      }

      console.log('motorista' ,  idMoto)

      const token = jwt.sign(
        { user: motorista.motonome, id: motorista.motocode, tipo: "motorista" },
        secretKey,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ token, tipo: "motorista", user: idMoto});

    } catch (error) {
      console.error("Erro no login do motorista:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  

};




