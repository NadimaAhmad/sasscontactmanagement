const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/contact-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema & Model
const contactSchema = new mongoose.Schema({
  name: String,
  instagram: String
});
const Contact = mongoose.model('Contact', contactSchema);

// CRUD Endpoints

// CREATE - POST /contacts
app.post('/contacts', async (req, res) => {
  const { name, instagram } = req.body;
  if (!name || !instagram) {
    return res.status(400).json({ error: 'Nama dan Instagram wajib diisi' });
  }
  try {
    const newContact = new Contact({ name, instagram });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menyimpan kontak' });
  }
});

// READ - GET /contacts
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil kontak' });
  }
});

// UPDATE - PUT /contacts/:id
app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, instagram } = req.body;
  if (!name || !instagram) {
    return res.status(400).json({ error: 'Nama dan Instagram wajib diisi' });
  }
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, instagram },
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ error: 'Kontak tidak ditemukan' });
    }
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui kontak' });
  }
});

// DELETE - DELETE /contacts/:id
app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ error: 'Kontak tidak ditemukan' });
    }
    res.json({ message: 'Kontak berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus kontak' });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});