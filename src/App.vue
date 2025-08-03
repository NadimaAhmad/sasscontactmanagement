<template>
  <div class="container-fluid py-4">
    <div class="text-center mb-4">
      <h1 class="display-5 fw-bold text-primary">Kontak Saya</h1>
      <p class="text-muted">Simpan kontak kenalanmu di sini</p>
    </div>

    <div class="row justify-content-center">
      <div class="col">
        <!-- Form Kontak -->
        <ContactForm 
          @add-contact="addContact"
          @update-contact="updateContact"
          :selected-contact="selectedContact"
          @reset-form="resetForm"
        />

<!-- revisi dikit-->
        <!-- Daftar Kontak -->
        <div v-if="contacts.length > 0" class="mt-4">
          <h5 class="mb-3">Daftar Kontak:</h5>
          <ul class="list-group">
            <li 
              v-for="contact in contacts" 
              :key="contact._id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{{ contact.name }}</strong> 
                <small class="text-muted">@{{ contact.instagram }}</small>
              </div>
              <div>
                <button class="btn btn-sm btn-outline-primary me-2" @click="editContact(contact)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteContact(contact._id)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="alert alert-info mt-4 text-center">
          Tidak ada kontak. Silakan tambahkan kontak baru!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContactForm from './components/ContactForm.vue'

export default {
  components: { ContactForm },
  data() {
    return {
      contacts: [],
      selectedContact: null
    }
  },
  mounted() {
    this.fetchContacts();
  },
  methods: {
    async fetchContacts() {
      try {
        const response = await fetch('http://localhost:3000/contacts');
        this.contacts = await response.json();
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    },
    async addContact(contact) {
      try {
        const response = await fetch('http://localhost:3000/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact)
        });
        const newContact = await response.json();
        this.contacts.push(newContact);
      } catch (error) {
        console.error('Error adding contact:', error);
      }
    },
    async updateContact(updatedContact) {
      try {
        const response = await fetch(`http://localhost:3000/contacts/${updatedContact._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedContact)
        });
        const data = await response.json();
        const index = this.contacts.findIndex(c => c._id === data._id);
        if (index !== -1) this.contacts.splice(index, 1, data);
        this.resetForm();
      } catch (error) {
        console.error('Error updating contact:', error);
      }
    },
    async deleteContact(id) {
      try {
        await fetch(`http://localhost:3000/contacts/${id}`, {
          method: 'DELETE'
        });
        this.contacts = this.contacts.filter(contact => contact._id !== id);
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    },
    editContact(contact) {
      this.selectedContact = { ...contact };
    },
    resetForm() {
      this.selectedContact = null;
    }
  }
}
</script>