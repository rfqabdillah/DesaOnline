<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Layanan' : 'Tambah Data Layanan' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Nama Layanan</label>
              <input type="text" class="form-control" v-model="formData.namalayanan" placeholder="Masukkan nama layanan" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Nama Desa</label>
              <select class="form-select" v-model="formData.iddesa" required :disabled="isDesaListLoading || !isSuperadmin">
                <option disabled value="">
                  {{ isDesaListLoading ? 'Memuat...' : 'Pilih Desa' }}
                </option>
                <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                  {{ desa.wilayah.namawilayah }}
                </option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Persyaratan</label>
              <div class="quill-editor-container">
                <QuillEditor 
                  theme="snow" 
                  toolbar="full" 
                  v-model:content="formData.persyaratan" 
                  contentType="html"
                  placeholder="Tulis persyaratan layanan di sini"
                  style="min-height: 200px;"
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Tahapan</label>
              <div class="quill-editor-container">
                <QuillEditor 
                  theme="snow" 
                  toolbar="full" 
                  v-model:content="formData.tahapan" 
                  contentType="html"
                  placeholder="Tulis tahapan layanan di sini"
                  style="min-height: 200px;"
                />
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
import { addService, updateService } from '@/services/general/services/services'; 
import { getProfiles } from '@/services/general/villageInformation/profile';
import { useToast } from "vue-toastification";
import { QuillEditor } from '@vueup/vue-quill';

const initialFormData = {
  iddesa: '',
  namalayanan: '',
  persyaratan: '',
  tahapan: '',
};

export default {
  name: 'addEditServiceModal',
  components: {QuillEditor,},
  props: {
    serviceToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      desaList: [],
      isDesaListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
      userRole: null, 
      userIdDesa: null,
    };
  },
  computed: {
    isEditMode() {
      return !!this.serviceToEdit;
    },
    isSuperadmin() {
      return this.userRole === 'Superadmin';
    },
  },
  watch: {
    serviceToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.iddesa = newData.iddesa;
          this.formData.judul = newData.judul;
          this.formData.konten = newData.konten;
          this.formData.gambar = newData.gambar;
        } else {
          this.formData = { ...initialFormData };

          if (!this.isSuperadmin && !this.isEditMode && this.userIdDesa) {
            this.formData.iddesa = this.userIdDesa;
          }
        }
        this.errorMessage = null;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.loadUserData();
    this.fetchDesaList();
  },
  methods: {
    loadUserData() {
      try {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const userProfile = userData?.data?.[0];
          if (userProfile) {
            this.userRole = userProfile.role?.nama_level;
            this.userIdDesa = userProfile.id_desa;

            // Jika bukan superadmin dan bukan mode edit, langsung set iddesa
            if (!this.isSuperadmin && !this.isEditMode) {
              this.formData.iddesa = this.userIdDesa;
            }
          }
        }
      } catch (error) {
        console.error("Gagal membaca data pengguna dari localStorage:", error);
        this.toast.error("Gagal memuat informasi pengguna.");
      }
    },
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
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();

      data.append('record[iddesa]', this.formData.iddesa);
      data.append('record[namalayanan]', this.formData.namalayanan);
      data.append('record[persyaratan]', this.formData.persyaratan);
      data.append('record[tahapan]', this.formData.tahapan);
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateService(this.serviceToEdit.idlayanan, data);
          this.toast.success("Data layanan berhasil diperbarui");
        } else {
          response = await addService(data);
          this.toast.success("Data layanan berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data layanan");
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

.quill-editor-container {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
.quill-editor-container:focus-within {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
:deep(.ql-toolbar) {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  border: none !important;
  border-bottom: 1px solid #dee2e6 !important;
}
:deep(.ql-container) {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  border: none !important;
}
:deep(.ql-editor) {
  min-height: 200px; 
  padding: 0.5rem 1rem;
}
</style>