<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Kelompok' : 'Tambah Data Kelompok' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
                <label class="form-label">Nama Kelompok </label>
                <input type="text" class="form-control" v-model="formData.namakelompok" required />
              </div>
            <div class="mb-3">
              <label class="form-label">Nama Desa</label>
              <select class="form-select" v-model="formData.iddesa" required :disabled="isDesaListLoading">
                <option disabled value="">
                  {{ isDesaListLoading ? 'Memuat daftar desa...' : 'Pilih Desa' }}
                </option>
                <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                  {{ desa.wilayah.namawilayah }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Kategori Kelompok</label>
              <select class="form-select" v-model="formData.idkategorikelompok" required :disabled="isCategoryListLoading">
                <option disabled value="">
                  {{ isCategoryListLoading ? 'Memuat daftar kategori...' : 'Pilih Kategori Kelompok' }}
                </option>
                <option v-for="category in categoryList" :key="category.idkategorikelompok" :value="category.idkategorikelompok">
                  {{ category.namakategorikelompok}}
                </option>
              </select>
            </div>

            <div class="row">
              <div class="mb-3">
                <label class="form-label">Deskripsi</label>
                <textarea class="form-control" v-model="formData.deskripsi" rows="4" placeholder="Deskripsi..."></textarea>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
              <label class="form-label">Upload Logo Usaha</label>
              <input type="file" class="form-control" accept="image/*" @change="handleLogoUpload" />
              
              <div class="mt-2">
                <div v-if="logoPreviewUrl">
                  <img :src="logoPreviewUrl" alt="Preview Logo" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
                <div v-else-if="isEditMode && formData.logo">
                  <img :src="formData.logo" alt="Logo Saat Ini" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Upload File SK</label>
              <input type="file" class="form-control" accept=".pdf,.doc,.docx,image/*" @change="handleFileUpload" />
              <div v-if="isEditMode && formData.filesk && !selectedSkFile" class="mt-2">
                File saat ini: <a :href="formData.filesk" target="_blank" rel="noopener noreferrer">Lihat File</a>
              </div>
              <div v-if="skFileName" class="mt-2">
                File baru: <strong>{{ skFileName }}</strong>
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
import { addGroup, updateGroup } from '@/services/general/population/groups'; 
import { getProfiles } from '@/services/general/villageInformation/profile';
import { getGroupCategories } from '@/services/referensi/groupCategories'
import { useToast } from "vue-toastification";

const initialFormData = {
  namakelompok: '',
  iddesa: '',
  idkategorikelompok: '',
  deskripsi: '',
  logo: null,
  filesk: null,
};

export default {
  name: 'addEditGroupModal',
  props: {
    groupToEdit: { type: Object, default: null }
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedSkFile: null,
      skFileName: '',
      selectedLogoFile: null,
      logoPreviewUrl: null, 
      desaList: [],
      categoryList: [],
      isDesaListLoading: false,
      isCategoryListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.groupToEdit;
    }
  },
  watch: {
    groupToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.namakelompok = newData.namakelompok;
          this.formData.iddesa = newData.iddesa;
          this.formData.idkategorikelompok = newData.idkategorikelompok;
          this.formData.deskripsi = newData.deskripsi;
          this.formData.filesk = newData.filesk;
          this.logo = newData.logo;
        } else {
          this.formData = { ...initialFormData };
        }
        this.selectedSkFile = null;
        this.skFileName = '';
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
    this.fetchCategoryList();
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
    async fetchCategoryList() {
      this.isCategoryListLoading = true;
      try {
        const response = await getGroupCategories({ limit: -1 });
        this.categoryList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar kategori kelompok.");
      } finally {
        this.isCategoryListLoading = false;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.selectedSkFile = null;
        this.skFileName = '';
        return;
      }
      this.selectedSkFile = file;
      this.skFileName = file.name;
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
      // this.errorMessage = null;
      // if (!this.formData.iddesa || !this.formData.tahunawal || !this.formData.tahunakhir || !this.formData.tanggal_sk) {
      //   this.errorMessage = 'Semua field dengan tanda bintang (*) wajib diisi.';
      //   return;
      // }
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();

      data.append('record[namakelompok]', this.formData.namakelompok);
      data.append('record[iddesa]', this.formData.iddesa);
      data.append('record[idkategorikelompok]', this.formData.idkategorikelompok);
      data.append('record[deskripsi]', this.formData.deskripsi);
      if (this.selectedSkFile) {
        data.append('upload_filesk', this.selectedSkFile);
      }
      if (this.selectedLogoFile) {
        data.append('upload_logo', this.selectedLogoFile);
      }
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateGroup(this.groupToEdit.idkelompok, data);
          this.toast.success("Data kelompok berhasil diperbarui");
        } else {
          response = await addGroup(data);
          this.toast.success("Data kelompok berhasil ditambah");
        }
        this.$emit('save-successful');
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data kelompok");
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
</style>