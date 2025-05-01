import {authenticateLogin} from "../model/dataAuth.js"
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY

async function AuthController(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "usuario e senha são obrigatorios" });
    }

    const user = await authenticateLogin(username, password);

    if (!user) {
      return res.status(401).json({ message: "Usuario ou senha invalidos" });
    }

    const token = jwt.sign({ id: user.username, password: user.password }, secretKey, { expiresIn: '1h' });

    return res.json({  token });
  } catch (error) {
    console.error("erro na autenticação do usuario:", error);
    return res.status(500).json({ message: "erro interno" });
  }
}

export {AuthController}
