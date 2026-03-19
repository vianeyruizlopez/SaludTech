const { pool } = require('../config/database');

// Orden de prioridad personalizado para que las Urgentes salgan primero
const PRIORITY_ORDER = `
  CASE t.prioridad 
    WHEN 'Urgente' THEN 1 
    WHEN 'Alta' THEN 2 
    WHEN 'Media' THEN 3 
    ELSE 4 
  END`;

const findAll = async (estado) => {
  // Traemos información extra: nombre del paciente y número de habitación
  let query = `
    SELECT t.*, p.nombre_completo as paciente, h.numero_habitacion
    FROM tareas t
    JOIN pacientes p ON t.id_paciente = p.id_paciente
    JOIN habitaciones h ON p.id_habitacion = h.id_habitacion`;
  
  const params = [];
  
  // Si el frontend pide solo las "Pendientes", filtramos aquí
  if (estado) { 
    query += ' WHERE t.estado = $1'; 
    params.push(estado); 
  }
  
  query += ` ORDER BY ${PRIORITY_ORDER}, t.created_at DESC`;
  
  const result = await pool.query(query, params);
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT t.*, p.nombre_completo as paciente 
     FROM tareas t 
     JOIN pacientes p ON t.id_paciente = p.id_paciente 
     WHERE t.id_tarea = $1`, 
    [id]
  );
  return result.rows[0];
};

const create = async ({ id_paciente, id_usuario_asignado, descripcion_tarea, prioridad, fecha_limite }, creatorId) => {
  const query = `
    INSERT INTO tareas 
    (id_paciente, id_usuario_creador, id_usuario_asignado, descripcion_tarea, prioridad, fecha_limite, estado) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING id_tarea`;
  
  const values = [
    id_paciente, 
    creatorId, 
    id_usuario_asignado || null, 
    descripcion_tarea, 
    prioridad || 'Media', 
    fecha_limite || null,
    'Pendiente' // Todas las tareas nuevas empiezan como Pendientes
  ];

  const result = await pool.query(query, values);
  return findById(result.rows[0].id_tarea);
};

// Esta es la función CLAVE para el botón del Enfermero (Toggle)
const updateEstado = async (id, estado) => {
  await pool.query(
    'UPDATE tareas SET estado = $1 WHERE id_tarea = $2', 
    [estado, id]
  );
  return findById(id);
};

const remove = async (id) => {
  await pool.query('DELETE FROM tareas WHERE id_tarea = $1', [id]);
};

// Buscamos tareas específicas de un paciente (útil para el Handoff)
const findByPaciente = async (id_paciente) => {
  const result = await pool.query(
    'SELECT * FROM tareas WHERE id_paciente = $1 ORDER BY created_at DESC',
    [id_paciente]
  );
  return result.rows;
};

module.exports = { 
  findAll, 
  findById, 
  create, 
  updateEstado, 
  remove,
  findByPaciente 
};