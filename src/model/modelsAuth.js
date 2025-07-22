
import  {pool} from "../database/dataBaseSgt.js"
import { client } from "../database/userDataBase.js";
import bcrypt from 'bcrypt'

export const modelsAuthenticateUser = {


async  authenticateLogin(username, password) {
  try {
      const query = `SELECT * FROM cademp WHERE "empmail" = $1 LIMIT 1`;
      const values = [username];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
          console.error("Usuario não encontrado.")
          return null;
      }
      const user = result.rows[0];

    //   const passwordMatch = await bcrypt.compare(password, user.empSenha);

    //   if (!passwordMatch) {
    //       return null; 
    //   }

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

      const result = await client.query(query, values);

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


