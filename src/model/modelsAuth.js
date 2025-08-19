
import  {poolSgt} from "../database/dataBaseSgt.js"
import { pool } from "../database/userDataBase.js";
import bcrypt from 'bcrypt'

export const modelsAuthenticateUser = {


async registerUserPattersAuth(data) {
     
  try {

    const {
       empcode,
       empnome,
       empnofa,
       empcnpj,
       empcep,
       emprua,
       empcida,
       empesta,
       emptele,
       empmail,
       empsenh,
       empbanc,
       empcont,
       empagen,
       emppix
    }= data
    const saltRounds = 10
 
     const passwordCript = await bcrypt.hash(empsenh , saltRounds)
     const query = `INSERT INTO cademp (
      empcode, empnome, empnofa, empcnpj, empcep, emprua,
      empcida, empesta, emptele, empmail, empsenh,
      empbanc, empcont, empagen, emppix
    ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
      $12, $13, $14, $15) RETURNING*`;

      const values = [empcode,
       empnome,
       empnofa,
       empcnpj,
       empcep,
       emprua,
       empcida,
       empesta,
       emptele,
       empmail,
       passwordCript,
       empbanc,
       empcont,
       empagen,
       emppix]

      const result = await poolSgt.query(query , values)

      return result.rows
  
   } catch (error) {
      console.error('Erro para cadastrar usuario do sistema')
      throw new Error('Erro para cadastrar um usuario no sistema')
  }
},

async  authenticateLogin(username, password) {
  try {
      const query = `SELECT * FROM cademp WHERE "empmail" = $1 LIMIT 1`;
      const values = [username];

      const result = await poolSgt.query(query, values);

      if (result.rows.length === 0) {
          console.error("Usuario não encontrado.")
          return null;
      }
      const user = result.rows[0];

      const passwordMatch = await bcrypt.compare(password, user.empsenh);

      if (!passwordMatch) {
          return null; 
      }

      return user;
  } catch (error) {
      console.error('Erro na autenticação:', error);
      throw error;
  }
},

  async authDriver (username , password){
         try {
      const query = `SELECT * FROM cadmoto WHERE motomail = $1 LIMIT 1`;
      const values = [username];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
          console.error("Usuario não encontrado.")
          return null;
      }
      const user = result.rows[0];

      const passwordMatch = await bcrypt.compare(password, user.motopasw);

      if (!passwordMatch) {
          return null; 
      }

      return user;
       } catch (error) {
      console.error('Erro na autenticação:', error);
      throw error;
     }
   }

}


