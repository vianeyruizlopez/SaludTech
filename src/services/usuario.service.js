const usuarioRepo = require('../repositories/usuario.repository');

const getAll = async () => {
  return await usuarioRepo.findAll();
};

const getById = async (id) => {
  const user = await usuarioRepo.findById(id);
  if (!user) throw { status: 404, message: 'Usuario no encontrado' };
  return user;
};

const create = async (userData) => {
  // 1. Verificamos si el email ya existe para no duplicar
  const existingUser = await usuarioRepo.findByEmail(userData.email);
  if (existingUser) throw { status: 400, message: 'El email ya está registrado' };

  // 2. Limpieza de datos (CURP en Mayúsculas)
  if (userData.curp) {
    userData.curp = userData.curp.trim().toUpperCase();
  }

  // 3. Validamos que el Rol sea válido antes de mandar al Repo
  const rolesValidos = ['Enfermero', 'Supervisor', 'RH'];
  if (userData.rol && !rolesValidos.includes(userData.rol)) {
    userData.rol = 'Enfermero'; // Valor por defecto por seguridad
  }

  return await usuarioRepo.create(userData);
};

const update = async (id, data) => {
  // 1. Verificamos que el usuario exista antes de intentar editarlo
  await getById(id); 
  
  // 2. Si viene un CURP nuevo, lo limpiamos
  if (data.curp) {
    data.curp = data.curp.trim().toUpperCase();
  }

  return await usuarioRepo.update(id, data);
};

const remove = async (id) => {
  // Verificamos existencia antes de borrar
  await getById(id); 
  await usuarioRepo.remove(id);
};

module.exports = { 
  getAll, 
  getById, 
  create, 
  update, 
  remove 
};