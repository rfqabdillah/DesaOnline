<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Kategori Artikel' : 'Tambah Data Kategori Artikel' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="col-md-8 mb-3">
              <label class="form-label">Nama Kategori Artikel</label>
              <input type="text" class="form-control" v-model="formData.namakategoriartikel" placeholder="Masukkan nama kategori artikell" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Nama Desa</label>
              <select class="form-select" v-model="formData.iddesa" required :disabled="isDesaListLoading">
                <option disabled value="">
                  {{ isDesaListLoading ? 'Memuat...' : 'Pilih Desa' }}
                </option>
                <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                  {{ desa.wilayah.namawilayah }}
                </option>
              </select>
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
import { addArticleCategory, updateArticleCategory } from '@/services/general/website/documentTypes'; 
import { getProfiles } from '@/services/general/villageInformation/profile';
import { useToast } from "vue-toastification";

const initialFormData = {
  iddesa: '',
  namakategoriartikel: '',
};

export default {
  name: 'addEditArticleCategoryModal',
  props: {
    articleCategoryToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      desaList: [],
      isDesaListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.articleCategoryToEdit;
    }
  },
  watch: {
    articleCategoryToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.iddesa = newData.id_desa || newData.iddesa || '';
          this.formData.namakategoriartikel = newData.namakategoriartikel;
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
        this.toast.error("Gagal memuat daftar desa");
      } finally {
        this.isDesaListLoading = false;
      }
    },
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();
      
      data.append('record[namakategoriartikel]', this.formData.namakategoriartikel);
      data.append('record[id_desa]', this.formData.iddesa);
      
      try {
        let response;

        if (this.isEditMode) {
            data.append('_method', 'PUT');
            response = await updateArticleCategory(this.articleCategoryToEdit.idkategoriartikel, data);
            this.toast.success("Data kategori artikel berhasil diperbarui");
        } else {
            response = await addArticleCategory(data);
            this.toast.success("Data kategori artikel berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data kategori artikel");
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