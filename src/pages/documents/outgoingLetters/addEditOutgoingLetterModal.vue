<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Surat Masuk' : 'Tambah Data Surat Masuk' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nomor Surat</label>
                <input type="text" class="form-control" v-model="formData.nomor_surat" placeholder="Masukkan nomor surat" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Perihal</label>
                <input type="text" class="form-control" v-model="formData.perihal" placeholder="Masukkan perihal surat" required />
              </div>
            </div>

            <div class="col mb-3">
                <label class="form-label">Instansi Penerima</label>
                <input type="text" class="form-control" v-model="formData.instansi_penerima" placeholder="Masukkan instansi penerima surat" required />
              </div>

            <div class="row">
              <div class="col mb-3">
                <label class="form-label">Tanggal Surat</label>
                <input type="date" class="form-control" v-model="formData.tanggal_surat" required />
              </div>
            </div>
            
            <div class="row">
              <div class="col mb-3">
                <label class="form-label">Desa</label>
                <select class="form-select" v-model="formData.id_desa" required :disabled="isListLoading">
                  <option disabled value="">
                    {{ isListLoading ? 'Memuat...' : 'Pilih Desa' }}
                  </option>
                  <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                    {{ desa.wilayah.namawilayah }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Jenis Surat</label>
              <select class="form-select" v-model="formData.id_jenis_surat_keluar" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Jenis Surat' }}
                </option>
                <option v-for="jenis in jenisSuratList" :key="jenis.idjenissuratkeluar" :value="jenis.idjenissuratkeluar">
                  {{ jenis.namajenissuratkeluar }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Ringkasan / Isi Surat</label>
              <textarea class="form-control" v-model="formData.ringkasan" placeholder="Masukkan ringkasan singkat isi surat" rows="3"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Upload File Surat</label>
              <input type="file" class="form-control" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" @change="handleFileUpload" />
              <div v-if="isEditMode && formData.file_surat && !selectedFile" class="mt-2">
                File saat ini: <a :href="formData.file_surat" target="_blank" rel="noopener noreferrer">Lihat File</a>
              </div>
              <div v-if="fileName" class="mt-2">
                  File baru: <strong>{{ fileName }}</strong>
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
import { addOutgoingLetter, updateOutgoingLetter } from '@/services/general/documents/outgoingLetters';
import { getProfiles } from '@/services/general/villageInformation/profile';
import { getOutgoingLetterTypes } from '@/services/referensi/outgoingLetterTypes'; 
import { useToast } from "vue-toastification";

const initialFormData = {
  id_desa: '',
  id_jenis_surat_keluar: '',
  nomor_surat: '',
  perihal: '',
  ringkasan: '',
  instansi_penerima: '',
  tanggal_surat: '',
  file_surat: null,
};

export default {
  name: 'addEditOutgoingLetterModal',
  props: {
    outgoingLetterToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      desaList: [],
      jenisSuratList: [],
      selectedFile: null,
      fileName: '',
      isListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.outgoingLetterToEdit;
    }
  },
  watch: {
    outgoingLetterToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.id_desa = newData.id_desa;
          this.formData.id_jenis_surat_keluar = newData.id_jenis_surat_keluar;
          this.formData.nomor_surat = newData.nomor_surat;
          this.formData.perihal = newData.perihal;
          this.formData.ringkasan = newData.ringkasan;
          this.formData.instansi_penerima = newData.instansi_penerima;
          this.formData.tanggal_surat = newData.tanggal_surat;
          this.formData.file_surat = newData.file_surat;
        } else {
          this.formData = { ...initialFormData };
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
    this.fetchDesaList();
    this.fetchJenisSuratList();
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
    async fetchJenisSuratList() {
        this.isListLoading = true;
        try {
            const response = await getOutgoingLetterTypes({ limit: -1 });
            this.jenisSuratList = response.data?.data || response.data?.[0]?.data || [];
        } catch (error) {
            this.toast.error("Gagal memuat daftar jenis surat");
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
      data.append('record[id_jenis_surat_keluar]', this.formData.id_jenis_surat_keluar);
      data.append('record[nomor_surat]', this.formData.nomor_surat);
      data.append('record[perihal]', this.formData.perihal);
      data.append('record[ringkasan]', this.formData.ringkasan);
      data.append('record[instansi_penerima]', this.formData.instansi_penerima);
      data.append('record[tanggal_surat]', this.formData.tanggal_surat);
      
      if (this.selectedFile) {
        data.append('upload_file_surat', this.selectedFile);
      }
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateOutgoingLetter(this.outgoingLetterToEdit.id_surat_keluar, data);
          this.toast.success("Data surat keluar berhasil diperbarui");
        } else {
          response = await addOutgoingLetter(data);
          this.toast.success("Data surat keluar berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data surat keluar");
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