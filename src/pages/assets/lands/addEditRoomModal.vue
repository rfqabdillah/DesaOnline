<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Ruangan' : 'Tambah Data Ruangan' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">

            <div class="mb-3">
              <label class="form-label">Induk Bangunan</label>
              <input type="text" class="form-control" :value="buildingData?.namagedung || 'Memuat...'" disabled />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Ruangan</label>
                <input type="text" class="form-control" v-model="formData.namaruangan" placeholder="Contoh: Ruang Rapat" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Kondisi Ruangan</label>
                <select class="form-select" v-model="formData.idkondisi" required :disabled="isListLoading">
                  <option disabled value="">
                    {{ isListLoading ? 'Memuat...' : 'Pilih Kondisi' }}
                  </option>
                  <option v-for="item in kondisiList" :key="item.idkondisi" :value="item.idkondisi">{{ item.namakondisi }}</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Keterangan</label>
              <textarea class="form-control" v-model="formData.keterangan" rows="3" placeholder="Tambahkan keterangan jika ada"></textarea>
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
import { addRoom, updateRoom } from '@/services/general/assets/rooms'; 
import { getConditions } from '@/services/referensi/conditions';
import { useToast } from "vue-toastification";

const initialFormData = {
  idgedung: '',
  namaruangan: '',
  keterangan: '',
  idkondisi: '',
};

export default {
  name: 'addEditRoomModal', 
  props: {
    roomToEdit: { type: Object, default: null },
    buildingData: { type: Object, required: true },
  },
  data() {
    return {
      formData: { ...initialFormData },
      kondisiList: [],
      isListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.roomToEdit;
    }
  },
  watch: {
    roomToEdit: {
      handler() {
        this.initializeForm();
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.fetchKondisiList(); 
  },
  methods: {
    initializeForm() {
      if (this.isEditMode) {
        this.formData.idgedung = this.roomToEdit.idgedung;
        this.formData.namaruangan = this.roomToEdit.namaruangan;
        this.formData.keterangan = this.roomToEdit.keterangan;
        this.formData.idkondisi = this.roomToEdit.idkondisi;
      } else {
        this.formData = { ...initialFormData };
        if (this.buildingData) {
          this.formData.idgedung = this.buildingData.idgedung;
        }
      }
      this.errorMessage = null;
    },
    closeModal() {
      this.$emit('close');
    },
    handleOverlayClick(e) {
      if (e.target === e.currentTarget)
        this.closeModal();
    },
    async fetchKondisiList() {
      this.isListLoading = true;
      try {
        const response = await getConditions({ limit: -1 });
        this.kondisiList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar kondisi");
      } finally {
        this.isListLoading = false;
      }
    },
    async submitForm() {
      if (!this.formData.idgedung) {
        this.errorMessage = "Data induk bangunan tidak ditemukan. Silakan tutup dan coba lagi.";
        return;
      }

      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();

      data.append('record[idgedung]', this.formData.idgedung);
      data.append('record[namaruangan]', this.formData.namaruangan);
      data.append('record[keterangan]', this.formData.keterangan);
      data.append('record[idkondisi]', this.formData.idkondisi);
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateRoom(this.roomToEdit.idruangan, data);
          this.toast.success("Data ruangan berhasil diperbarui");
        } else {
          response = await addRoom(data);
          this.toast.success("Data ruangan berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error(this.errorMessage);
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
  background: white; border-radius: 8px; width: 90%; max-width: 600px;
  max-height: 90vh; box-shadow: 0 5px 15px rgba(0,0,0,.5);
  display: flex; flex-direction: column;
}
.modal-header, .modal-footer {
  padding: 1rem; flex-shrink: 0;
}
.modal-body {
  padding: 1.5rem; overflow-y: auto; flex-grow: 1;
}
.modal-header { 
  border-bottom: 1px solid #dee2e6; display: flex; 
  justify-content: space-between; align-items: center; 
}
.modal-footer { 
  border-top: 1px solid #dee2e6; display: flex; 
  justify-content: flex-end; gap: 0.5rem; 
}
</style>