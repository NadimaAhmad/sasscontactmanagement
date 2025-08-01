<template>
  <form @submit.prevent="handleSubmit" class="mb-4">
    <div class="mb-3">
      <input 
        v-model="form.name" 
        type="text" 
        class="form-control" 
        placeholder="Nama" 
        required 
      />
    </div>
    <div class="mb-3">
      <input 
        v-model="form.instagram" 
        type="text" 
        class="form-control" 
        placeholder="Instagram" 
        required 
      />
    </div>
    <button type="submit" class="btn btn-success w-100">
      <i class="bi bi-save"></i> {{ isEditMode ? 'Perbarui' : 'Simpan' }}
    </button>
    <button v-if="isEditMode" type="button" class="btn btn-secondary w-100 mt-2" @click="$emit('reset-form')">
      Batal
    </button>
  </form>
</template>

<script>
export default {
  props: {
    selectedContact: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        instagram: ''
      }
    }
  },
  computed: {
    isEditMode() {
      return this.selectedContact && this.selectedContact._id;
    }
  },
  watch: {
    selectedContact(newVal) {
      if (newVal) {
        this.form = { ...newVal };
      } else {
        this.resetForm();
      }
    }
  },
  methods: {
    handleSubmit() {
      if (this.isEditMode) {
        this.$emit('update-contact', this.form);
      } else {
        this.$emit('add-contact', this.form);
      }
      this.resetForm();
    },
    resetForm() {
      this.form = {
        name: '',
        instagram: ''
      };
    }
  }
}
</script>