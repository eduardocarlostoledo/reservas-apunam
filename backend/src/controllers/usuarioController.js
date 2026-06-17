const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { Op } = require('sequelize');

const SALT_ROUNDS = 10;

async function loginUsuario(req, res) {
  try {
    const { nro_legaj, nro_docum } = req.body;

    const usuario = await Usuario.findOne({
      where: { nro_legaj, activo: true },
    });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(String(nro_docum), usuario.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, nro_legaj: usuario.nro_legaj, role: 'usuario' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nro_legaj: usuario.nro_legaj,
        nro_docum: usuario.nro_docum,
        apellido: usuario.apellido,
        nombre: usuario.nombre,
      },
    });
  } catch (error) {
    console.error('Error in loginUsuario:', error);
    res.status(500).json({ error: 'Error en login' });
  }
}

async function getUsuarios(req, res) {
  try {
    const { search, activo, page = 1, limit = 20 } = req.query;
    const where = {};

    if (activo !== undefined && activo !== '') {
      where.activo = activo === 'true';
    }

    if (search) {
      where[Op.or] = [
        { apellido: { [Op.iLike]: `%${search}%` } },
        { nombre: { [Op.iLike]: `%${search}%` } },
        { nro_docum: { [Op.like]: `%${search}%` } },
      ];
      const parsed = parseInt(search, 10);
      if (!isNaN(parsed)) {
        where[Op.or].push({ nro_legaj: parsed });
      }
    }

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const { count, rows } = await Usuario.findAndCountAll({
      where,
      order: [['apellido', 'ASC'], ['nombre', 'ASC']],
      limit: parseInt(limit, 10),
      offset,
    });

    res.json({
      usuarios: rows,
      total: count,
      page: parseInt(page, 10),
      totalPages: Math.ceil(count / parseInt(limit, 10)),
    });
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

async function getUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error fetching usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
}

async function createUsuario(req, res) {
  try {
    const { nro_legaj, nro_docum, apellido, nombre } = req.body;

    const existente = await Usuario.findOne({ where: { nro_legaj } });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese legajo' });
    }

    const password_hash = await bcrypt.hash(String(nro_docum), SALT_ROUNDS);
    const usuario = await Usuario.create({
      nro_legaj,
      nro_docum: String(nro_docum),
      password_hash,
      apellido,
      nombre,
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error('Error creating usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}

async function updateUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { nro_legaj, nro_docum, apellido, nombre } = req.body;

    if (nro_legaj && nro_legaj !== usuario.nro_legaj) {
      const existente = await Usuario.findOne({ where: { nro_legaj } });
      if (existente) {
        return res.status(409).json({ error: 'Ya existe un usuario con ese legajo' });
      }
      usuario.nro_legaj = nro_legaj;
    }

    if (nro_docum && nro_docum !== usuario.nro_docum) {
      usuario.nro_docum = String(nro_docum);
      usuario.password_hash = await bcrypt.hash(String(nro_docum), SALT_ROUNDS);
    }

    if (apellido) usuario.apellido = apellido;
    if (nombre) usuario.nombre = nombre;

    await usuario.save();
    res.json(usuario);
  } catch (error) {
    console.error('Error updating usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}

async function toggleUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuario.activo = !usuario.activo;
    await usuario.save();
    res.json(usuario);
  } catch (error) {
    console.error('Error toggling usuario:', error);
    res.status(500).json({ error: 'Error al cambiar estado del usuario' });
  }
}

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

async function uploadCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió archivo CSV' });
    }

    const content = req.file.buffer.toString('utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    if (lines.length < 2) {
      return res.status(400).json({ error: 'El archivo CSV está vacío o no tiene datos' });
    }

    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/"/g, ''));
    const legajIdx = headers.indexOf('nro_legaj');
    const documIdx = headers.indexOf('nro_docum');
    const appatIdx = headers.indexOf('desc_appat');
    const nombrIdx = headers.indexOf('desc_nombr');

    if (legajIdx < 0 || documIdx < 0 || appatIdx < 0 || nombrIdx < 0) {
      return res.status(400).json({
        error: 'CSV debe tener columnas: nro_legaj, nro_docum, desc_appat, desc_nombr',
      });
    }

    let created = 0;
    let updated = 0;
    let errors = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const cols = parseCSVLine(lines[i]);
        const nro_legaj = parseInt(cols[legajIdx], 10);
        const nro_docum = cols[documIdx].replace(/"/g, '');
        const apellido = cols[appatIdx].replace(/"/g, '');
        const nombre = cols[nombrIdx].replace(/"/g, '');

        if (isNaN(nro_legaj) || !nro_docum || !apellido || !nombre) {
          errors.push(`Línea ${i + 1}: datos inválidos`);
          continue;
        }

        const password_hash = await bcrypt.hash(nro_docum, SALT_ROUNDS);
        const existente = await Usuario.findOne({ where: { nro_legaj } });

        if (existente) {
          existente.nro_docum = nro_docum;
          existente.password_hash = password_hash;
          existente.apellido = apellido;
          existente.nombre = nombre;
          existente.activo = true;
          await existente.save();
          updated++;
        } else {
          await Usuario.create({
            nro_legaj,
            nro_docum,
            password_hash,
            apellido,
            nombre,
          });
          created++;
        }
      } catch (lineErr) {
        errors.push(`Línea ${i + 1}: ${lineErr.message}`);
      }
    }

    res.json({
      message: `Importación completada: ${created} creados, ${updated} actualizados`,
      created,
      updated,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    });
  } catch (error) {
    console.error('Error uploading CSV:', error);
    res.status(500).json({ error: 'Error al procesar archivo CSV' });
  }
}

module.exports = {
  loginUsuario,
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  toggleUsuario,
  uploadCSV,
};
