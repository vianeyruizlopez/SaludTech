const usuarioService = require('../services/usuario.service');
const ExcelJS = require('exceljs'); 

const getAll = async (req, res) => {
  try {
    const users = await usuarioService.getAll();
    res.json(users);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const user = await usuarioService.getById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre_completo, email, password_hash, curp } = req.body;
    
    if (!nombre_completo || !email || !curp) {
        return res.status(400).json({ message: 'Nombre, Email y CURP son obligatorios' });
    }

    const newUser = await usuarioService.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const user = await usuarioService.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await usuarioService.remove(req.params.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};


const exportExcel = async (req, res) => {
  try {
    const users = await usuarioService.getAll();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Personal Hospitalario');

    sheet.columns = [
      { header: 'Nombre Completo', key: 'nombre_completo', width: 30 },
      { header: 'Correo Electrónico', key: 'email', width: 25 },
      { header: 'CURP', key: 'curp', width: 20 },
      { header: 'Rol', key: 'rol', width: 15 },
      { header: 'Turno', key: 'turno_asignado', width: 15 },
      { header: 'Estado', key: 'activo', width: 10 }
    ];

    sheet.addRows(users);
    sheet.getRow(1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Personal_RH.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Error al generar el archivo Excel' });
  }
};

const exportPDF = async (req, res) => {
  try {
    res.status(200).json({ message: "Generando reporte PDF... (Requiere PDFKit)" });
  } catch (err) {
    res.status(500).json({ message: 'Error al generar PDF' });
  }
};

module.exports = { 
    getAll, 
    getById, 
    create, 
    update, 
    remove, 
    exportExcel, 
    exportPDF 
};