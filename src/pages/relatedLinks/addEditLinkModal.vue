<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Link Terkait' : 'Tambah Data Link Terkait' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Nama Desa</label>
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
              <label class="form-label">Nama Link</label>
              <input type="text" class="form-control" v-model="formData.nama" placeholder="Masukkan nama link" required />
            </div>

            <div class="mb-3">
              <label class="form-label">URL</label>
              <input type="text" class="form-control" v-model="formData.url" placeholder="Masukkan alamat url terkait">
            </div>

            <div class="mb-3">
              <label class="form-label">Upload Logo</label>
              <input type="file" class="form-control" accept="image/*" @change="handleLogoUpload" />
              
              <div class="mt-2">
                <div v-if="logoPreviewUrl">
                  <img :src="logoPreviewUrl" alt="Preview Logo" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
                <div v-else-if="isEditMode && formData.logolink">
                  <img :src="formData.logolink" alt="Logo Saat Ini" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
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
import { addRelatedLink, updateRelatedLink } from '@/services/general/relatedLinks/relatedLinks';
import { getProfiles } from '@/services/general/villageInformation/profile';
import { useToast } from "vue-toastification";

const initialFormData = {
  iddesa: '',
  nama: '',
  url: '',
  logolink: null,
};

export default {
  name: 'addEditLinkModal',
  props: {
    linkToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedLogoFile: null,
      logoPreviewUrl: null, 
      desaList: [],
      isDesaListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.linkToEdit;
    }
  },
  watch: {
    linkToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.iddesa = newData.iddesa;
          this.formData.nama = newData.nama;
          this.formData.url = newData.url;
          this.formData.logolink = newData.logolink;
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
        this.toast.error("Gagal memuat daftar desa");
      } finally {
        this.isDesaListLoading = false;
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
      data.append('record[nama]', this.formData.nama);
      data.append('record[url]', this.formData.url);
      if (this.selectedLogoFile) {
        data.append('upload_logolink', this.selectedLogoFile);
      }
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateRelatedLink(this.linkToEdit.idlink, data);
          this.toast.success("Data link terkait berhasil diperbarui");
        } else {
          response = await addRelatedLink(data);
          this.toast.success("Data link terkait berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data link terkait");
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