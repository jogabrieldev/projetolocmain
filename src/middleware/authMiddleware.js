import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

 const authenticateToken = (req, res, next) => {

  const tokenInit = req.headers['authorization'];
  const token = tokenInit.split(" ")[1]

  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
   
  try {
      jwt.verify(token, SECRET_KEY , ()=>{
        if (err) return res.status(403).json({ message: "Token inválido ou expirado" });
        req.user = decoded;
        next();
      })
         
  } catch (error) {
     console.error('Erro na aplicação: ' ,  error)
     res.status(500).json({
        message: 'Token invalid '
     })
  }
 
};

export default authenticateToken