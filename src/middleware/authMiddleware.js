import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

 const authenticateToken = (req, res, next) => {

  const tokenInit = req.headers['authorization'];
  
  if(!tokenInit){
     return res.status(401).json({message: "Token não fornecido"})
  }
  const token = tokenInit.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: 'Formato de token invalido' });
  }
   
  try {
        const decoded = jwt.verify(token, SECRET_KEY );
          req.user = decoded; 
          next(); 
      
         
  } catch (error) {
     console.error('Erro na aplicação: ' ,  error)
     res.status(403).json({
        message: 'Token invalid '
     })
  }
 
};

export default authenticateToken