const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { pool, testConnection } = require('./Database/db');

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.post('/notes', async (req, res) => {
    const { title, datetime, note } = req.body;
    const sql = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.query(sql, [title, datetime, note]);
        res.send('Note berhasil ditambahkan!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal menambahkan note!');
    }
});

app.get('/notes', async (req, res) => {
    const sql = 'SELECT * FROM notes';
    try {
        const [results] = await pool.query(sql);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan saat menampilkan note!');
    }
});

app.get('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM notes WHERE id = ?';
    try {
        const [result] = await pool.query(sql, [id]);
        if (result.length === 0) {
            res.status(404).send('Note tidak ditemukan!');
        } else {
            res.json(result[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan saat menampilkan note!');
    }
});

app.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, datetime, note } = req.body;
    const sql = 'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?';
    try {
        const [result] = await pool.query(sql, [title, datetime, note, id]);
        if (result.affectedRows === 0) {
            res.status(404).send('Note tidak ditemukan!');
        } else {
            res.send('Note berhasil diupdate!');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan saat mengupdate note!');
    }
});

app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM notes WHERE id = ?';
    try {
        const [result] = await pool.query(sql, [id]);
        if (result.affectedRows === 0) {
            res.status(404).send('Note tidak ditemukan!');
        } else {
            res.send('Note berhasil dihapus!');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan saat menghapus note!');
    }
});

app.listen(process.env.APP_PORT, async () => {
    await testConnection();
    console.log(`Server is running at http://localhost:${process.env.APP_PORT}`);
});
