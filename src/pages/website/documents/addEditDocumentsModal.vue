<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Dokumen' : 'Tambah Data Dokumen' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Desa</label>
              <select class="form-select" v-model="formData.iddesa" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Desa' }}
                </option>
                <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                  {{ desa.wilayah.namawilayah }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Nama Dokumen</label>
              <input type="text" class="form-control" v-model="formData.namadokumen" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Jenis Dokumen</label>
              <select class="form-select" v-model="formData.idjenisdokumen" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Jenis Dokumen' }}
                </option>
                <option v-for="type in documentTypeList" :key="type.idjenisdokumen" :value="type.idjenisdokumen">
                  {{ type.namajenisdokumen }}
                </option>
              </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Tahun Terbit</label>
                <input type="number" class="form-control" v-model="formData.tahun_terbit" placeholder="YYYY" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Upload File</label>
              <input type="file" class="form-control" accept=".pdf,.doc,.docx,image/*" @change="handleFileUpload" />
              <div v-if="isEditMode && formData.dokumen && !selectedFile" class="mt-2">
                File saat ini: <a :href="formData.dokumen" target="_blank" rel="noopener noreferrer">Lihat File</a>
              </div>
              <div v-if="FileName" class="mt-2">
                File baru: <strong>{{ FileName }}</strong>
              </div>
            </div>
            

            <div class="mb-3">
                <label class="form-label">Deskripsi</label>
                <textarea class="form-control" rows="3" v-model="formData.deskripsi" placeholder="Jelaskan tentang dokumen tersebut" required></textarea>
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
import { addDocument, updateDocument } from "@/services/general/website/documents";
import { getProfiles } from "@/services/general/villageInformation/profile";
import { getDocumentTypes } from "@/services/general/website/documentTypes";
import { useToast } from "vue-toastification";

const initialFormData = {
  selectedFile: null,
  FileName: '',
  namadokumen: '',
  idjenisdokumen: '',
  deskripsi: '',
  tahun_terbit: '',
  iddesa: '',
  file: null,
};

export default {
  name: 'addEditDocumentModal',
  props: {
    documentToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      documentTypeList: [],
      desaList: [],
      isListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.documentToEdit;
    }
  },
  watch: {
    documentToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.namadokumen = newData.namadokumen;
          this.formData.idjenisdokumen = newData.idjenisdokumen;
          this.formData.deskripsi = newData.deskripsi;
          this.formData.tahun_terbit = newData.tahun_terbit;
          this.formData.iddesa = newData.iddesa;
          this.formData.dokumen = newData.dokumen;
        } else {
          this.formData = { ...initialFormData };
        }
        this.selectedFile = null;
        this.FileName = '';
        this.errorMessage = null;
      },
      immediate: true,
      deep: true,
    }
  },
  async created() {
    await this.fetchDesaList();
    await this.fetchTypeList();
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
    async fetchTypeList() {
      this.isListLoading = true;
      try {
        const response = await getDocumentTypes({ limit: -1 });
        this.documentTypeList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar jenis dokumen");
      } finally {
        this.isListLoading = false;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.selectedFile = null;
        this.FileName = '';
        return;
      }
      this.selectedFile = file;
      this.FileName = file.name;
    },
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();
      
      data.append('record[namadokumen]', this.formData.namadokumen);
      data.append('record[idjenisdokumen]', this.formData.idjenisdokumen);
      data.append('record[deskripsi]', this.formData.deskripsi || '');
      data.append('record[tahun_terbit]', this.formData.tahun_terbit);
      data.append('record[iddesa]', this.formData.iddesa);
      if (this.selectedFile) {
        data.append('upload_dokumen', this.selectedFile);
      }
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateDocument(this.documentToEdit.iddokumen, data); 
          this.toast.success("Data dokumen berhasil diperbarui");
        } else {
          response = await addDocument(data);
          this.toast.success("Data dokumen berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data dokumen");
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