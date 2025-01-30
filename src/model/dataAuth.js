
// const userDataBase = require("../database/userDataBase");

import  {pool} from "../database/dataBaseSgt.js"


    async function autenticateLogin  (username, password) {
       const query =
        "SELECT * FROM cademp WHERE empmail = $1 AND empsenh = $2 LIMIT 1";
       const values = [username, password];

       const result = await pool.query(query, values);
       return result.rows[0];
  }

export {autenticateLogin}
