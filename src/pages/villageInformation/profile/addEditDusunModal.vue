<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">{{ isEditMode ? 'Edit Data Dusun' : 'Tambah Data Dusun' }}</h5>
        <button type="button" class="btn-close" @click="closeModal"></button>
      </div>
      <div class="modal-body">
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="namawilayah" class="form-label">Nama Desa</label>
            <input type="text" id="namawilayah" class="form-control" :value="profileData?.wilayah?.namawilayah" disabled readonly />
          </div>
          <div class="mb-3">
            <label for="namadusun" class="form-label">Nama Dusun</label>
            <input type="text" id="namadusun" class="form-control" v-model="formData.namadusun" placeholder="Masukkan nama dusun" required />
          </div>
          <div class="mb-3">
            <label for="idpenduduk" class="form-label">Nama Kepala Dusun</label>
            <select id="idpenduduk" class="form-select" v-model="formData.idpenduduk" :disabled="isLoading">
              <option disabled value="">
                {{ filteredResidents.length > 0 ? 'Pilih Kepala Dusun' : 'Tidak ada penduduk di desa ini' }}
              </option>
              <option v-for="resident in filteredResidents" :key="resident.idpenduduk" :value="resident.idpenduduk">
                {{ resident.nama }})
              </option>
            </select>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Batal</button>
        <button type="button" class="btn btn-primary" @click="submitForm" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
          <span v-else>Simpan</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { addDusun, updateDusun } from '@/services/general/villageInformation/dusun';
import { getResidents } from '@/services/general/population/residents';
import { useToast } from "vue-toastification";

const initialFormData = {
  namadusun: '',
  idpenduduk: '',
  iddesa: null,
};

export default {
  name: 'AddEditDusunModal',
  props: {
    dusunToEdit: { type: Object, default: null },
    profileData: { type: Object, required: true }
  },
  data() {
    return {
      formData: { ...initialFormData },
      residents: [], // Master list of all residents
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.dusunToEdit;
    },
    filteredResidents() {
      if (!this.profileData || !this.profileData.iddesa) {
        return [];
      }
      return this.residents.filter(resident => {
        return resident.dusun && resident.dusun.iddesa === this.profileData.iddesa;
      });
    }
  },
  watch: {
    dusunToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.namadusun = newData.namadusun;
          this.formData.idpenduduk = newData.idpenduduk;
          this.formData.iddesa = newData.iddesa;
        } else {
          this.formData = { ...initialFormData };
        }
        if (this.profileData) {
            this.formData.iddesa = this.profileData.iddesa;
        }
        this.errorMessage = null;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.fetchResidents();
  },
  methods: {
    closeModal() {
        this.$emit('close');
    },
    handleOverlayClick(e) {
      if (e.target === e.currentTarget)
        this.closeModal();
    },
    async fetchResidents() {
      this.isLoading = true;
      try {
        const response = await getResidents({ limit: -1 });
        this.residents = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar penduduk");
      } finally {
        this.isLoading = false;
      }
    },
    async submitForm() {
        this.isLoading = true;
        this.errorMessage = null;
        
        const data = new FormData();
        data.append('record[iddesa]', this.formData.iddesa);
        data.append('record[namadusun]', this.formData.namadusun);
        data.append('record[idpenduduk]', this.formData.idpenduduk);
        
        try {
            if (this.isEditMode) {
                data.append('_method', 'PUT');
                await updateDusun(this.dusunToEdit.iddusun, data);
                this.toast.success("Data dusun berhasil diperbarui");
            } else {
                await addDusun(data);
                this.toast.success("Data dusun berhasil ditambah");
            }
            this.$emit('save-successful');
            this.closeModal();
        } catch (error) {
            this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.';
            this.toast.error("Gagal menyimpan data dusun");
        } finally {
            this.isLoading = false;
        }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1055;
}
.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-header, .modal-footer, .modal-body {
  padding: 1rem;
}
.modal-header {
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-body {
  overflow-y: auto;
}
.modal-footer { 
  border-top: 1px solid #dee2e6; display: flex; 
  justify-content: flex-end; gap: 0.5rem; 
}
</style>
