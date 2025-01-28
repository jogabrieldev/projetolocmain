const db = require("../database/dataBaseSgt");
const userDataBase = require("../database/userDataBase");

const AuthController = {
  
  autenticateLogin: async (username, password) => {
    const query =
      "SELECT * FROM cademp WHERE empmail = $1 AND empsenh = $2 LIMIT 1";
    const values = [username, password];

    const result = await db.query(query, values);
    return result.rows[0];
  },
};

module.exports = AuthController;
