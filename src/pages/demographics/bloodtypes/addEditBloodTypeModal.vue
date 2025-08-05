<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">{{ isEditMode ? 'Edit Data Golongan Darah' : 'Tambah Data Golongan Darah' }}</h5>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="namagolongandarah" class="form-label">Nama Golongan Darah</label>
            <input 
              type="text" 
              class="form-control" 
              id="namaGolonganDarah" 
              placeholder="Masukkan nama golongan darah"
              v-model="formData.namagolongandarah" required>
          </div>
          
          <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-danger" @click="closeModal">Batal</button>
        <button type="button" class="btn btn-primary" @click="submitForm" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>Simpan</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { addBloodType, updateBloodType } from '@/services/referensi/bloodTypes';
import { useToast } from "vue-toastification";

export default {
  name: 'editBloodTypeModal',
  props: {
    bloodTypeToEdit: {
      type: Object,
      default: null
    }
  },
  created() {
    this.toast = useToast();
  },
  data() {
    return {
      formData: {
        namagolongandarah: '',
      },
      isLoading: false,
      errorMessage: null,
    };
  },
  computed: {
    isEditMode() {
      return !!this.bloodTypeToEdit;
    }
  },
  watch: {
    bloodTypeToEdit: {
      handler(newData) {
        if (newData) {
          // Mode Edit: Salin data ke formData
          this.formData = { ...newData }; 
        } else {
          // Mode Tambah: Reset formData dengan benar
          this.formData = { 
            namagolongandarah: '',
          };
        }
        this.errorMessage = null;
      },
      immediate: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleOverlayClick(event) {
      if (event.target === event.currentTarget) {
        this.closeModal();
      }
    },
    async submitForm() {
      this.errorMessage = null;
      // DIUBAH: Menggunakan this.formData
      const { namagolongandarah } = this.formData;
      if ( !namagolongandarah ) {
        this.errorMessage = 'Semua field wajib diisi.';
        return;
      }
      this.isLoading = true;
      try {
        if (this.isEditMode) {
          // DIUBAH: Menggunakan this.formData
          await updateBloodType(this.bloodTypeToEdit.idgolongandarah, this.formData);
          this.toast.success("Data golongan darah berhasil diperbarui", { icon: 'fa fa-check' });
        } else {
          // DIUBAH: Menggunakan this.formData
          await addBloodType(this.formData);
          this.toast.success("Data golongan darah berhasil ditambah", { icon: 'fa fa-check' });
        }
        this.$emit('save-successful');
        this.closeModal(); 
      } catch (error) {
        console.error('Error occurred:', error); 
        this.errorMessage = error.response?.data?.message || 'Gagal menyimpan data.';
        this.toast.error("Gagal menyimpan data golongan darah", { icon: 'fa fa-times' });
      } finally {
        this.isLoading = false;
      }
    }
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6); display: flex;
  justify-content: center; align-items: center; z-index: 1050;
}
.modal-content {
  background: white; border-radius: 8px; width: 90%;
  max-width: 500px; box-shadow: 0 5px 15px rgba(0,0,0,.5);
  display: flex; flex-direction: column;
}
.modal-header, .modal-body, .modal-footer { padding: 1rem; }
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #dee2e6;
}
.modal-footer {
  display: flex; justify-content: flex-end; gap: 0.5rem;
  border-top: 1px solid #dee2e6;
}
.btn-close { border: none; background: transparent; font-size: 1.5rem; }
</style>