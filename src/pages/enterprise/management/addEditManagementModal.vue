<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Pengurus Usaha' : 'Tambah Data Pengurus Usaha' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Nama Usaha</label>
              <select class="form-select" v-model="formData.idusaha" required :disabled="isUsahaListLoading">
                <option disabled value="">
                  {{ isUsahaListLoading ? 'Memuat...' : 'Pilih Usaha' }}
                </option>
                <option v-for="usaha in usahaList" :key="usaha.idusaha" :value="usaha.idusaha">
                  {{ usaha.namausaha }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Tanggal SK</label>
              <input type="date" class="form-control" v-model="formData.tanggal_sk" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Upload File SK</label>
              <input type="file" class="form-control" accept=".pdf,.doc,.docx,image/*" @change="handleFileUpload" />
              <div v-if="isEditMode && formData.filesk && !selectedSkFile" class="mt-2">
                File saat ini: <a :href="formData.filesk" target="_blank" rel="noopener noreferrer">Lihat File</a>
              </div>
              <div v-if="skFileName" class="mt-2">
                File baru: <strong>{{ skFileName }}</strong>
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
import { addManagement, updateManagement } from '@/services/general/enterprise/management'; 
import { getProfileEnterprises } from '@/services/general/enterprise/profileEnterprise';
import { useToast } from "vue-toastification";

const initialFormData = {
  idusaha: '',
  tanggal_sk: '',
  filesk: null,
};

export default {
  name: 'addEditManagementModal',
  props: {
    managementToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedSkFile: null,
      skFileName: '',
      usahaList: [],
      isUsahaListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.managementToEdit;
    }
  },
  watch: {
    managementToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.idusaha = newData.idusaha;
          this.formData.tanggal_sk = newData.tanggal_sk;
          this.formData.filesk = newData.filesk;
        } else {
          this.formData = { ...initialFormData };
        }
        this.selectedSkFile = null;
        this.skFileName = '';
        this.errorMessage = null;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.fetchUsahaList();
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
      this.isUsahaListLoading = true;
      try {
        const response = await getProfileEnterprises({ limit: -1 });
        this.usahaList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar usaha");
      } finally {
        this.isUsahaListLoading = false;
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
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();

      data.append('record[idusaha]', this.formData.idusaha);
      data.append('record[tanggal_sk]', this.formData.tanggal_sk);
      
      if (this.selectedSkFile) {
        data.append('upload_filesk', this.selectedSkFile);
      }
      try {
        let response;

        if (this.isEditMode) {
            data.append('_method', 'PUT');
            response = await updateManagement(this.managementToEdit.idpengurus, data);
            this.toast.success("Data pengurus usaha berhasil diperbarui");
        } else {
            response = await addManagement(data);
            this.toast.success("Data pengurus usaha berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data pengurus usaha");
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