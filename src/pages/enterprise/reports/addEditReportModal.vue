<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Laporan Usaha' : 'Tambah Data Laporan Usaha' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Nama Usaha</label>
              <select class="form-select" v-model="formData.idusaha" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Nama Usaha' }}
                </option>
                <option v-for="usaha in usahaList" :key="usaha.idusaha" :value="usaha.idusaha">
                  {{ usaha.namausaha }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Periode Laporan</label>
              <select class="form-select" v-model="formData.idperiodelaporan" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Periode Laporan' }}
                </option>
                <option v-for="periode in reportPeriodeList" :key="periode.idperiodelaporan" :value="periode.idperiodelaporan">
                  {{ periode.namaperiodelaporan }}
                </option>
              </select>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Tanggal Laporan</label>
                <input type="date" class="form-control" v-model="formData.tanggallaporan" required />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Upload File Laporan</label>
                <input type="file" class="form-control" accept=".pdf,.doc,.docx,image/*" @change="handleFileUpload" />
                <div v-if="isEditMode && formData.filelaporan && !selectedFile" class="mt-2">
                  File saat ini: <a :href="formData.filelaporan" target="_blank" rel="noopener noreferrer">Lihat File</a>
                </div>
                <div v-if="FileName" class="mt-2">
                  File baru: <strong>{{ FileName }}</strong>
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
import { addReport, updateReport } from "@/services/general/enterprise/reports";
import { getProfileEnterprises } from '@/services/general/enterprise/profileEnterprise'; 
import { getReportPeriods } from '@/services/referensi/reportPeriods'; 
import { useToast } from "vue-toastification";

const initialFormData = {
  selectedFile: null,
  FileName: '',
  idperiodelaporan: '',
  idusaha: '',
  tanggallaporan: '',
  file: null,
};

export default {
  name: 'addEditReportModal',
  props: {
    reportToEdit: { type: Object, default: null },
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
      return !!this.reportToEdit;
    }
  },
  watch: {
    reportToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.idperiodelaporan = newData.idperiodelaporan;
          this.formData.idusaha = newData.idusaha;
          this.formData.tanggallaporan = newData.tanggallaporan;
          this.formData.filelaporan = newData.filelaporan;
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
    await this.fetchUsahaList();
    await this.fetchPeriodeList();
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleOverlayClick(e) {
      if (e.target === e.currentTarget)
        this.closeModal();
    },
    async fetchUsahaList() {
      this.isListLoading = true;
      try {
        const response = await getProfileEnterprises({ limit: -1 });
        this.usahaList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar badan usaha");
      } finally {
        this.isListLoading = false;
      }
    },
    async fetchPeriodeList() {
      this.isListLoading = true;
      try {
        const response = await getReportPeriods({ limit: -1 });
        this.reportPeriodeList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar periode laporan usaha");
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
      
      data.append('record[idperiodelaporan]', this.formData.idperiodelaporan);
      data.append('record[idusaha]', this.formData.idusaha);
      data.append('record[tanggallaporan]', this.formData.tanggallaporan);
      if (this.selectedFile) {
        data.append('upload_filelaporan', this.selectedFile);
      }
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateReport(this.reportToEdit.idlaporanusaha, data); 
          this.toast.success("Data laporan usaha berhasil diperbarui");
        } else {
          response = await addReport(data);
          this.toast.success("Data laporan usaha berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data laporan usaha");
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