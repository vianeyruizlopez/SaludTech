const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Error interno' });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Error interno' });
  }
};

const loginFirebase = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken requerido' });
    const result = await authService.loginWithFirebase(idToken);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Error interno' });
  }
};

module.exports = { register, login, loginFirebase };
