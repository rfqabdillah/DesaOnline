<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Artikel' : 'Tambah Data Artikel' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Penerbit</label>
              <input type="text" class="form-control" v-model="publisherName" disabled />
            </div>

            <div class="mb-3">
              <label class="form-label">Judul Artikel</label>
              <input type="text" class="form-control" v-model="formData.judul" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Slug</label>
              <input type="text" class="form-control" v-model="generatedSlug" disabled />
            </div>
            
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
              <label class="form-label">Kategori Artikel</label>
              <select class="form-select" v-model="formData.idkategoriartikel" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Kategori Artikel' }}
                </option>
                <option v-for="category in categoryList" :key="category.idkategoriartikel" :value="category.idkategoriartikel">
                  {{ category.namakategoriartikel }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Upload Gambar</label>
              <input type="file" class="form-control" accept="image/*" @change="handleGambarUpload" />
              
              <div class="mt-2">
                <div v-if="gambarPreviewUrl">
                  <img :src="gambarPreviewUrl" alt="Preview Gambar" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
                <div v-else-if="isEditMode && formData.gambar">
                  <img :src="formData.gambar" alt="Gambar Saat Ini" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Konten</label>
              <textarea class="form-control" rows="5" v-model="formData.konten" placeholder="Tulis konten artikel di sini" required></textarea>
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
import axios from 'axios';
import { addArticle, updateArticle } from "@/services/general/website/article"; 
import { getProfiles } from "@/services/general/villageInformation/profile";
import { getArticleCategories } from "@/services/general/website/articleCategory";
import { useToast } from "vue-toastification";

const initialFormData = {
  judul: '',
  slug: '',
  idkategoriartikel: '',
  konten: '',
  iddesa: '',
  idpengguna: '',
  gambar: null,
};

export default {
  name: 'addEditArticleModal',
  props: {
    articleToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      publisherName: 'Memuat...',
      selectedFile: null,
      gambarPreviewUrl: null, 
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
      return !!this.articleToEdit;
    },
    generatedSlug() {
      if (!this.formData.judul) return '';
      return this.formData.judul.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''); 
    }
  },
  watch: {
    articleToEdit: {
      async handler(newData) {
        this.selectedFile = null;
        this.errorMessage = null;
        this.gambarPreviewUrl = null; 

        if (newData) {
          this.formData = {
            judul: newData.judul,
            slug: newData.slug,
            idkategoriartikel: newData.idkategoriartikel,
            konten: newData.konten,
            iddesa: newData.iddesa,
            idpengguna: newData.idpengguna,
            gambar: newData.gambar,
          };
          this.publisherName = newData.pengguna?.nama || '-';
        } else {
          this.formData = { ...initialFormData };
          await this.fetchCurrentUser();
        }
      },
      immediate: true,
      deep: true,
    }
  },
  async created() {
    await this.fetchDesaList();
    await this.fetchCategoryList();
  },
  methods: {
    closeModal() { this.$emit('close'); },
    handleOverlayClick(e) { if (e.target === e.currentTarget) this.closeModal(); },
    
    async fetchCurrentUser() {
      const userData = JSON.parse(localStorage.getItem('User')) || {};
      const userId = userData.id_pengguna; 
      const token = userData.token;

      if (userId && token) {
        this.formData.idpengguna = userId;
        try {
          const res = await axios.get('/api/api', {
            params: { act: 'users', key: userId },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const userInfo = res.data?.[0]?.data?.[0];
          this.publisherName = userInfo?.name || 'Pengguna tidak ditemukan';
        } catch (error) {
          console.error('Gagal mengambil nama user:', error);
          this.toast.error("Gagal memuat nama penerbit.");
          this.publisherName = 'Nama Gagal Dimuat';
        }
      } else {
        this.publisherName = 'Tidak ada sesi login';
        this.formData.idpengguna = '';
      }
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
        const response = await getArticleCategories({ limit: -1 });
        this.categoryList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar kategori artikel");
      } finally {
        this.isListLoading = false;
      }
    },
    
    // MODIFIKASI: Nama method dan logika disesuaikan
    handleGambarUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.selectedFile = null;
        this.gambarPreviewUrl = null;
        return;
      }

      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.gambarPreviewUrl = URL.createObjectURL(file);
      } else {
        this.selectedFile = null;
        this.gambarPreviewUrl = null;
        this.toast.error("File yang dipilih harus berupa gambar.");
        event.target.value = '';
      }
    },

    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;

      if (!this.formData.idpengguna) {
          this.errorMessage = 'Data penerbit tidak valid. Mohon muat ulang halaman.';
          this.isLoading = false;
          return;
      }

      const data = new FormData();
      data.append('record[judul]', this.formData.judul);
      data.append('record[slug]', this.generatedSlug);
      data.append('record[idkategoriartikel]', this.formData.idkategoriartikel);
      data.append('record[konten]', this.formData.konten || '');
      data.append('record[iddesa]', this.formData.iddesa);
      data.append('record[idpengguna]', this.formData.idpengguna);

      if (this.selectedFile) data.append('upload_gambar', this.selectedFile);
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateArticle(this.articleToEdit.idartikel, data); 
          this.toast.success("Data artikel berhasil diperbarui");
        } else {
          response = await addArticle(data);
          this.toast.success("Data artikel berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Coba lagi';
        this.toast.error("Gagal menyimpan data artikel");
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
