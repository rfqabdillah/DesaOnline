<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Badan Usaha' : 'Tambah Data Badan Usaha' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Nama Desa <span class="text-danger">*</span></label>
              <select class="form-select" v-model="formData.iddesa" required :disabled="isDesaListLoading">
                <option disabled value="">
                  {{ isDesaListLoading ? 'Memuat...' : 'Pilih Desa' }}
                </option>
                <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                  {{ desa.wilayah.namawilayah }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Bidang Usaha <span class="text-danger">*</span></label>
              <select class="form-select" v-model="formData.idbidangusaha" required :disabled="isBusinessFieldsLoading">
                <option disabled value="">
                  {{ isBusinessFieldsLoading ? 'Memuat...' : 'Pilih Bidang Usaha' }}
                </option>
                <option v-for="field in businessFields" :key="field.idbidangusaha" :value="field.idbidangusaha">
                  {{ field.namabidangusaha }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Nama Usaha <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="formData.namausaha" placeholder="Masukkan nama usaha" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Alamat Usaha</label>
              <textarea class="form-control" v-model="formData.alamatusaha" rows="3" placeholder="Masukkan alamat lengkap usaha"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Deskripsi Usaha</label>
              <textarea class="form-control" v-model="formData.deskripsiusaha" rows="4" placeholder="Jelaskan tentang badan usaha"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Upload Logo Usaha</label>
              <input type="file" class="form-control" accept="image/*" @change="handleLogoUpload" />
              
              <div class="mt-2">
                <div v-if="logoPreviewUrl">
                  <img :src="logoPreviewUrl" alt="Preview Logo" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
                <div v-else-if="isEditMode && formData.logousaha">
                  <img :src="formData.logousaha" alt="Logo Saat Ini" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
              </div>
            </div>
            
            <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="closeModal">Batal</button>
          <button type="button" class="btn btn-primary" @click="submitForm" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
            <span v-else>Simpan</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addProfileEnterprise, updateProfileEnterprise } from '@/services/general/enterprise/profileEnterprise'; 
import { getProfiles } from '@/services/general/villageInformation/profile';
import { getBusinessFields } from '@/services/referensi/businessFields';
import { useToast } from "vue-toastification";

const initialFormData = {
  iddesa: '',
  idbidangusaha: '',
  namausaha: '',
  alamatusaha: '',
  deskripsiusaha: '',
  logousaha: null,
};

export default {
  name: 'addEditProfileModal',
  props: {
    profileToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedLogoFile: null,
      logoPreviewUrl: null, 
      desaList: [],
      businessFields: [],
      isDesaListLoading: false,
      isBusinessFieldsLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.profileToEdit;
    }
  },
  watch: {
    profileToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.iddesa = newData.iddesa;
          this.formData.idbidangusaha = newData.idbidangusaha;
          this.formData.namausaha = newData.namausaha;
          this.formData.alamatusaha = newData.alamatusaha;
          this.formData.deskripsiusaha = newData.deskripsiusaha;
          this.formData.logousaha = newData.logousaha;
        } else {
          this.formData = { ...initialFormData };
        }
        this.selectedLogoFile = null;
        this.logoPreviewUrl = null;
        this.errorMessage = null;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.fetchDesaList();
    this.fetchBusinessFields(); 
  },
  beforeUnmount() {
    if (this.logoPreviewUrl) {
      URL.revokeObjectURL(this.logoPreviewUrl);
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleOverlayClick(e) {
      if (e.target === e.currentTarget)
        this.closeModal();
    },
    async fetchDesaList() {
      this.isDesaListLoading = true;
      try {
        const response = await getProfiles({ limit: -1 });
        this.desaList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar desa.");
      } finally {
        this.isDesaListLoading = false;
      }
    },
    async fetchBusinessFields() {
      this.isBusinessFieldsLoading = true;
      try {
        const response = await getBusinessFields({ limit: -1 });
        this.businessFields = response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar bidang usaha.");
      } finally {
        this.isBusinessFieldsLoading = false;
      }
    },

    handleLogoUpload(event) {
      const file = event.target.files[0];

      if (this.logoPreviewUrl) {
        URL.revokeObjectURL(this.logoPreviewUrl);
      }

      if (!file) {
        this.selectedLogoFile = null;
        this.logoPreviewUrl = null;
        return;
      }
      this.selectedLogoFile = file;
      this.logoPreviewUrl = URL.createObjectURL(file);
    },
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();

      data.append('record[iddesa]', this.formData.iddesa);
      data.append('record[idbidangusaha]', this.formData.idbidangusaha);
      data.append('record[namausaha]', this.formData.namausaha);
      data.append('record[alamatusaha]', this.formData.alamatusaha);
      data.append('record[deskripsiusaha]', this.formData.deskripsiusaha);
      if (this.selectedLogoFile) {
        data.append('upload_logousaha', this.selectedLogoFile);
      }
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateProfileEnterprise(this.profileToEdit.idusaha, data);
          this.toast.success("Data badan usaha berhasil diperbarui.");
        } else {
          response = await addProfileEnterprise(data);
          this.toast.success("Data badan usaha berhasil ditambah.");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.';
        this.toast.error("Gagal menyimpan data badan usaha.");
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
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050;
}
.modal-content {
  background: white; border-radius: 8px; width: 90%; max-width: 700px;
  max-height: 90vh; box-shadow: 0 5px 15px rgba(0,0,0,.5);
  display: flex; flex-direction: column;
}
.modal-header, .modal-footer {
  padding: 1rem; flex-shrink: 0;
}
.modal-body {
  padding: 1rem; overflow-y: auto; flex-grow: 1;
}
.modal-header { 
  border-bottom: 1px solid #dee2e6; display: flex; 
  justify-content: space-between; align-items: center; 
}
.modal-footer { 
  border-top: 1px solid #dee2e6; display: flex; 
  justify-content: flex-end; gap: 0.5rem; 
}
.text-danger { 
  color: #dc3545 !important; 
}

.img-thumbnail {
  padding: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  height: auto;
}
</style>