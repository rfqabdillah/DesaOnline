<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">{{ isEditMode ? 'Edit Data Prosedur Penguasaan' : 'Tambah Data Prosedur Penguasaan' }}</h5>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="namaprosedurpenguasaan" class="form-label">Nama Prosedur Penguasaan</label>
            <input 
              type="text" 
              class="form-control" 
              id="namaProsedurPenguasaan" 
              placeholder="Masukkan nama prosedur penguasaan"
              v-model="formData.namaprosedurpenguasaan" required>
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
import { addAcquisitionProcedure, updateAcquisitionProcedure } from '@/services/referensi/acquisitionProcedures';
import { useToast } from "vue-toastification";

export default {
  name: 'editAcquisitionProcedureModal',
  props: {
    acquisitionProcedureToEdit: {
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
        namaprosedurpenguasaan: '',
      },
      isLoading: false,
      errorMessage: null,
    };
  },
  computed: {
    isEditMode() {
      return !!this.acquisitionProcedureToEdit;
    }
  },
  watch: {
    acquisitionProcedureToEdit: {
      handler(newData) {
        if (newData) {
          this.formData = { ...newData }; 
        } else {
          this.formData = { 
            namaprosedurpenguasaan: '',
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
      const { namaprosedurpenguasaan } = this.formData;
      if ( !namaprosedurpenguasaan ) {
        this.errorMessage = 'Semua field wajib diisi.';
        return;
      }
      this.isLoading = true;
      try {
        if (this.isEditMode) {
          // DIUBAH: Menggunakan this.formData
          await updateAcquisitionProcedure(this.acquisitionProcedureToEdit.idprosedurpenguasaan, this.formData);
          this.toast.success("Data prosedur penguasaan berhasil diperbarui", { icon: 'fa fa-check' });
        } else {
          // DIUBAH: Menggunakan this.formData
          await addAcquisitionProcedure(this.formData);
          this.toast.success("Data prosedur penguasaan berhasil ditambah", { icon: 'fa fa-check' });
        }
        this.$emit('save-successful');
        this.closeModal(); 
      } catch (error) {
        console.error('Error occurred:', error); 
        this.errorMessage = error.response?.data?.message || 'Gagal menyimpan data.';
        this.toast.error("Gagal menyimpan data prosedur penguasaan", { icon: 'fa fa-times' });
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
  max-width: 700px; box-shadow: 0 5px 15px rgba(0,0,0,.5);
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