<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">{{ isEditMode ? 'Edit Data Wilayah' : 'Tambah Wilayah Baru' }}</h5>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="regionCode" class="form-label">Kode Wilayah</label>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Masukkan kode wilayah"
              id="regionCode" 
              v-model="formData.region_code" required>
          </div>
          <div class="mb-3">
            <label for="regionName" class="form-label">Nama Wilayah</label>
            <input 
              type="text" 
              class="form-control" 
              id="regionName" 
              placeholder="Masukkan nama wilayah"
              v-model="formData.region_name" required>
          </div>
          <div class="mb-3">
            <label for="regionType" class="form-label">Tipe Wilayah</label>
            <select class="form-select" id="regionType" v-model="formData.region_type" required> <option value="" disabled>Pilih tipe wilayah...</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
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
import { addRegion, updateRegion } from '@/services/referensi/regions';
import { useToast } from "vue-toastification";

export default {
  name: 'editRegionModal',
  props: {
    regionToEdit: {
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
        region_code: '',
        region_name: '',
        region_type: '',
      },
      isLoading: false,
      errorMessage: null,
    };
  },
  computed: {
    isEditMode() {
      return !!this.regionToEdit;
    }
  },
  watch: {
    regionToEdit: {
      handler(newData) {
        if (newData) {
          this.formData = { ...newData }; 
        } else {
          this.formData = { 
            region_code: '',
            region_name: '',
            region_type: '',
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
      const { region_code, region_name, region_type } = this.formData;
      if (!region_code || !region_name || !region_type) {
        this.errorMessage = 'Semua field wajib diisi.';
        return;
      }
      this.isLoading = true;
      try {
        if (this.isEditMode) {        
          await updateRegion(this.regionToEdit.region_id, this.formData);
          this.toast.success("Data wilayah berhasil diperbarui", { icon: 'fa fa-check' });
        } else {
          await addRegion(this.formData);
          this.toast.success("Data wilayah berhasil ditambah", { icon: 'fa fa-check' });
        }
        this.$emit('save-successful');
        this.closeModal(); 
      } catch (error) {
        console.error('Error occurred:', error); 
        this.errorMessage = error.response?.data?.message || 'Gagal menyimpan data.';
        this.toast.error("Gagal menyimpan data wilayah", { icon: 'fa fa-times' });
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
</style>