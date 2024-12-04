const userRegister = require("../model/data");

async function registerBens(req, res) {
  try {
    const { data } = req.body;
    const newUser = await userRegister.registerDateFormBens(data);
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = registerBens;
