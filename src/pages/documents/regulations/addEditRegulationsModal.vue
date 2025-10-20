<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Regulasi' : 'Tambah Data Regulasi' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-8 mb-3">
                <label class="form-label">Judul Regulasi</label>
                <input type="text" class="form-control" v-model="formData.judul" placeholder="Masukkan judul regulasi" required />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Tahun</label>
                <input type="number" class="form-control" v-model="formData.tahun" placeholder="YYYY" required />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Desa</label>
                <select class="form-select" v-model="formData.id_desa" required :disabled="isListLoading || !isSuperadmin">
                  <option disabled value="">
                    {{ isListLoading ? 'Memuat...' : 'Pilih Desa' }}
                  </option>
                  <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                    {{ desa.wilayah.namawilayah }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Jenis Regulasi</label>
                <select class="form-select" v-model="formData.idjenisregulasi" required :disabled="isListLoading">
                  <option disabled value="">
                    {{ isListLoading ? 'Memuat...' : 'Pilih Jenis Regulasi' }}
                  </option>
                  <option v-for="jenis in jenisRegulasiList" :key="jenis.idjenisregulasi" :value="jenis.idjenisregulasi">
                    {{ jenis.namajenisregulasi }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Deskripsi</label>
              <textarea class="form-control" v-model="formData.deskripsi" placeholder="Masukkan deskripsi singkat regulasi" rows="3"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Upload Dokumen</label>
              <input type="file" class="form-control" accept=".pdf,.doc,.docx" @change="handleFileUpload" />
              <div v-if="isEditMode && formData.dokumen && !selectedFile" class="mt-2">
                Dokumen saat ini: <a :href="formData.dokumen" target="_blank" rel="noopener noreferrer">Lihat Dokumen</a>
              </div>
              <div v-if="fileName" class="mt-2">
                  Dokumen baru: <strong>{{ fileName }}</strong>
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
import { addRegulation, updateRegulation } from '@/services/general/documents/regulations';
import { getProfiles } from '@/services/general/villageInformation/profile';
import { getRegulationTypes } from '@/services/referensi/regulationTypes'; 
import { useToast } from "vue-toastification";

const initialFormData = {
  id_desa: '',
  idjenisregulasi: '',
  judul: '',
  tahun: '',
  deskripsi: '',
  dokumen: null,
};

export default {
  name: 'addEditRegulationModal',
  props: {
    regulationToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      desaList: [],
      jenisRegulasiList: [],
      selectedFile: null,
      fileName: '',
      isListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
      userRole: null,
      userIdDesa: null,
    };
  },
  computed: {
    isSuperadmin() {
      return this.userRole === 'Superadmin';
    },
    isEditMode() {
      return !!this.regulationToEdit;
    },
  },
  watch: {
    regulationToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.id_desa = newData.id_desa;
          this.formData.idjenisregulasi = newData.idjenisregulasi;
          this.formData.judul = newData.judul;
          this.formData.tahun = newData.tahun;
          this.formData.deskripsi = newData.deskripsi;
          this.formData.dokumen = newData.dokumen;
        } else {
          this.formData = { ...initialFormData };

          // Jika bukan superadmin, set iddesa saat form direset
          if (!this.isSuperadmin && !this.isEditMode && this.userIdDesa) {
            this.formData.id_desa = this.userIdDesa;
          }
        }
        this.errorMessage = null;
        this.selectedFile = null;
        this.fileName = '';
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.loadUserData();
    this.fetchDesaList();
    this.fetchJenisRegulasiList();
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
              this.formData.id_desa = this.userIdDesa;
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
      this.isListLoading = true;
      try {
        const response = await getProfiles({ limit: -1 });
        this.desaList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar desa");
      } finally {
        this.isListLoading = false;
      }
    },
    async fetchJenisRegulasiList() {
        this.isListLoading = true;
        try {
            const response = await getRegulationTypes({ limit: -1 });
            this.jenisRegulasiList = response.data?.data || response.data?.[0]?.data || [];
        } catch (error) {
            this.toast.error("Gagal memuat daftar jenis regulasi");
        } finally {
            this.isListLoading = false;
        }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.selectedFile = null;
        this.fileName = '';
        return;
      }
      this.selectedFile = file;
      this.fileName = file.name;
    },
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();

      data.append('record[id_desa]', this.formData.id_desa);
      data.append('record[idjenisregulasi]', this.formData.idjenisregulasi);
      data.append('record[judul]', this.formData.judul);
      data.append('record[tahun]', this.formData.tahun);
      data.append('record[deskripsi]', this.formData.deskripsi);
      
      if (this.selectedFile) {
        data.append('upload_dokumen', this.selectedFile);
      }
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateRegulation(this.regulationToEdit.idregulasi, data);
          this.toast.success("Data regulasi berhasil diperbarui");
        } else {
          response = await addRegulation(data);
          this.toast.success("Data regulasi berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data regulasi");
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