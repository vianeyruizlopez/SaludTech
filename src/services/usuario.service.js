const usuarioRepo = require('../repositories/usuario.repository');

const getAll = async () => usuarioRepo.findAll();

const getById = async (id) => {
  const user = await usuarioRepo.findById(id);
  if (!user) throw { status: 404, message: 'Usuario no encontrado' };
  return user;
};

const create = async (userData) => {
  const existingUser = await usuarioRepo.findByEmail(userData.email);
  if (existingUser) throw { status: 400, message: 'El email ya está registrado' };

  // Aquí podrías encriptar la contraseña si no viene de Firebase
  // userData.password_hash = await bcrypt.hash(userData.password, 10);

  return usuarioRepo.create(userData);
};

const update = async (id, data) => {
  await getById(id); 
  return usuarioRepo.update(id, data);
};

const remove = async (id) => {
  await getById(id); 
  await usuarioRepo.remove(id);
};

module.exports = { getAll, getById, create, update, remove };