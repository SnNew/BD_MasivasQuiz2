const express = require('express');
const pool = require('./db');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/api/prueba', (req, res) => {
    res.send('Api funcionando de manera correcta');
});

app.get('/api/prueba1', (req, res) => {
    res.status(200).json({ message: 'Ruta prueba1 funcionando correctamente' });
});

// API para obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            details: err.message
        });
    }
});

// API para crear un usuario
app.post('/api/usuarios', async (req, res) => {
    const { cedula, nombre, edad, profesion } = req.body;
    const query = 'INSERT INTO usuarios (cedula, nombre, edad, profesion) VALUES ($1, $2, $3, $4)';
    try {
        await pool.query(query, [cedula, nombre, edad, profesion]);
        res.status(201).json({
            success: true,
            message: "Usuario creado correctamente"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el usuario",
            details: err.message
        });
    }
});

// API para actualizar un usuario
app.put('/api/usuarios/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const { nombre, edad, profesion } = req.body;
    const query = 'UPDATE usuarios SET nombre = $1, edad = $2, profesion = $3 WHERE cedula = $4';
    try {
        const result = await pool.query(query, [nombre, edad, profesion, cedula]);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No existe el usuario con cédula ${cedula}`
            });
        } else {
            res.status(200).json({
                success: true,
                message: `Usuario con cédula ${cedula} actualizado correctamente`
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el usuario",
            details: err.message
        });
    }
});

// API para eliminar un usuario
app.delete('/api/eliminar/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const query = 'DELETE FROM usuarios WHERE cedula = $1';
    try {
        const result = await pool.query(query, [cedula]);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No existe el registro con cédula ${cedula}`
            });
        } else {
            res.status(200).json({
                success: true,
                message: `Registro con cédula ${cedula} eliminado correctamente`
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el registro",
            details: err.message
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Servidor corriendo');
});
