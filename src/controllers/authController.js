import {modelsAuthenticateUser} from "../model/modelsAuth.js"
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY

export const authSystemValidade = {

  
  async registerUserSystem(req ,res ){
      
      try {
          const {data} = req.body
          if(!data){
            return res.status(400).json({message:"Obrigatorio passar todos os dados"})
          }

          const user = await modelsAuthenticateUser.registerUserPattersAuth(data)
          if(!user){
            return res.status(400).json({message:'ERRO para criar o usuario verifique por favor'})
          }

          return res.status(200).json({message:'Cadastrado com sucesso',success:true , user:user})
        } catch (error) {
           console.error('Erro para cadastrar um novo usuario no sistema', error)
           return res.status(500).json({success:false ,  message:"Erro no servidor para cadastrar"})
        }
  },

  // Login para funcionário
  async AuthLoginCenter(req, res) {
    try {
      const { username, password } = req.body;
      console.log('corpo' ,  req.body)
      
      if (!username || !password ) {
        return res.status(400).json({ message: "Usuário e senha obrigatórios" });
      }

         const user = await modelsAuthenticateUser.authenticateLogin(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      const idUserMain = user.empcode
      if(!idUserMain){
         return res.status(400).json({message:'O id não foi encontrado'})
      }

      const token = jwt.sign(
        { user: user.username, id: user.empcode, tipo: "main" },
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
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Usuário e senha obrigatórios" });
      }

      const motorista = await modelsAuthenticateUser.authDriver(username, password);

      if (!motorista) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      // Redireciona para externo se for
      if (motorista.motositu === "Externo") {
        return this.loginMotoristaExterno(req, res, motorista);
      }

      const idMoto = motorista.motocode;

      if (!idMoto) {
        return res.status(400).json({ message: 'Id do motorista não encontrado' });
      }

      const token = jwt.sign(
        { user: motorista.motonome, id: motorista.motocode, tipo: "motoristaInterno" },
        secretKey,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ token, tipo: "motoristaInterno", user: idMoto });

    } catch (error) {
      console.error("Erro no login do motorista interno:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async loginMotoristaExterno(req, res, motorista) {
    try {
      const idMoto = motorista.motocode;

      if (!idMoto) {
        return res.status(400).json({ message: 'Id do motorista externo não encontrado' });
      }

      const token = jwt.sign(
        { user: motorista.motonome, id: motorista.motocode, tipo: "motoristaExterno" },
        secretKey,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ token, tipo: "motoristaExterno", user: idMoto });

    } catch (error) {
      console.error("Erro no login do motorista externo:", error);
      return res.status(500).json({ message: "Erro interno do servidor (externo)" });
    }
  }
};





