import {autenticateLogin} from "../model/dataAuth.js"

async function AuthController(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "usuario e senha são obrigatorios" });
    }

    const user = await autenticateLogin(username, password);

    if (!user) {
      return res.status(401).json({ message: "Usuario ou senha invalidos" });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso",
      user: { id: user.id, username: user.empmail },
    });
  } catch (error) {
    console.error("erro na autenticação do usuario:", error);
    return res.status(500).json({ message: "erro interno" });
  }
}

export {AuthController}
