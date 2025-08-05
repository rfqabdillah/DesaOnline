<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Kegiatan' : 'Tambah Data Kegiatan' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
          <div class="mb-3">
              <label class="form-label">Nama Desa</label>
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
              <label class="form-label">Nama Kategori Kegiatan</label>
              <select class="form-select" v-model="formData.idkategorikegiatan" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Kategori Kegiatan' }}
                </option>
                <option v-for="category in categoryList" :key="category.idkategorikegiatan" :value="category.idkategorikegiatan">
                  {{ category.namakategorikegiatan }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Judul Program</label>
              <input type="text" class="form-control" v-model="formData.judul" placeholder="Masukkan judul program" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Konten Program</label>
              <textarea class="form-control" v-model="formData.konten" rows="4" placeholder="Tuliskan isi konten program" required ></textarea>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Tanggal Mulai</label>
                <input type="date" class="form-control" v-model="formData.tanggalmulai" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Tanggal Selesai</label>
                <input type="date" class="form-control" v-model="formData.tanggalselesai" required />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Jam Pelaksanaan</label>
              <input type="time" class="form-control" v-model="formData.jampelaksanaan" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Upload Poster</label>
              <input type="file" class="form-control" accept="image/*" @change="handlePosterUpload" />
              
              <div class="mt-2">
                <div v-if="posterPreviewUrl">
                  <img :src="posterPreviewUrl" alt="Preview Poster" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
                <div v-else-if="isEditMode && formData.poster">
                  <img :src="formData.poster" alt="Poster Saat Ini" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
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
import { addProgram, updateProgram } from '@/services/general/activities/programs';
import { getCategories} from '@/services/general/activities/activityCategories'; 
import { getProfiles } from '@/services/general/villageInformation/profile';
import { useToast } from "vue-toastification";

const initialFormData = {
  idkategorikegiatan: '',
  iddesa: '',
  judul: '',
  konten: '',
  tanggalmulai: '',
  tanggalselesai: '',
  jampelaksanaan: '',
  poster: null,
};

export default {
  name: 'addEditProgramModal',
  props: {
    programToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedPosterFile: null,
      PosterPreviewUrl: null, 
      categoryList: [],
      desaList: [],
      isListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.programToEdit;
    }
  },
  watch: {
    programToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.idkategorikegiatan = newData.idkategorikegiatan;
          this.formData.iddesa = newData.iddesa;
          this.formData.judul = newData.judul;
          this.formData.konten = newData.konten;
          this.formData.tanggalmulai = newData.tanggalmulai;
          this.formData.tanggalselesai = newData.tanggalselesai;
          this.formData.jampelaksanaan = newData.jampelaksanaan;
          this.formData.poster = newData.poster;
        } else {
          this.formData = { ...initialFormData };
        }
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
  beforeUnmount() {
    if (this.posterPreviewUrl) {
      URL.revokeObjectURL(this.posterPreviewUrl);
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
    async fetchCategoryList() {
      this.isListLoading = true;
      try {
        const response = await getCategories({ limit: -1 });
        this.categoryList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar kategori kegiatan");
      } finally {
        this.isListLoading = false;
      }
    },
    handlePosterUpload(event) {
      const file = event.target.files[0];

      if (this.posterPreviewUrl) {
        URL.revokeObjectURL(this.posterPreviewUrl);
      }

      if (!file) {
        this.selectedPosterFile = null;
        this.posterPreviewUrl = null;
        return;
      }
      this.selectedPosterFile = file;
      this.posterPreviewUrl = URL.createObjectURL(file);
    },
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();
      
      data.append('record[idkategorikegiatan]', this.formData.idkategorikegiatan);
      data.append('record[iddesa]', this.formData.iddesa);
      data.append('record[judul]', this.formData.judul);
      data.append('record[konten]', this.formData.konten);
      data.append('record[tanggalmulai]', this.formData.tanggalmulai);
      data.append('record[tanggalselesai]', this.formData.tanggalselesai);
      data.append('record[jampelaksanaan]', this.formData.jampelaksanaan);
      if (this.selectedPosterFile) {
        data.append('upload_poster', this.selectedPosterFile);
      }
      
      try {
        let response;

        if (this.isEditMode) {
            data.append('_method', 'PUT');
            response = await updateProgram(this.programToEdit.idkegiatan, data);
            this.toast.success("Data kegiatan berhasil diperbarui");
        } else {
            response = await addProgram(data);
            this.toast.success("Data kegiatan berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data kegiatan");
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