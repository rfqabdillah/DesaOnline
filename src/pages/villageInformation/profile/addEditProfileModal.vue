<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Profil Desa' : 'Tambah Data Profil Desa' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <!-- Form -->
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Nama Desa</label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  :value="selectedRegionName"
                  placeholder="Pilih wilayah dengan menekan tombol 'Cari'"
                  readonly
                  required
                />
                <button type="button" class="btn btn-primary" @click="openRegionSelector">
                  <i class="fa fa-search"></i> Cari
                </button>
              </div>
            </div>

            <div class="row">
              <div class="col-md-8 mb-3">
                <label class="form-label">Alamat Kantor Desa </label>
                <input type="text" class="form-control" v-model="formData.alamatkantor" placeholder="Masukkan alamat kantor desa" required />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Kode Pos</label>
                <input type="text" class="form-control" v-model="formData.kodepos" placeholder="Masukkan kode pos kantor desa" required />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Koordinat</label>
              <input type="text" class="form-control" v-model="formData.koordinat" placeholder="Masukkan koordinat kantor desa" required/>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Email Desa</label>
                <input type="email" class="form-control" v-model="formData.email" placeholder="Masukkan email desa" required/>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Website</label>
                <input type="text" class="form-control" v-model="formData.website" placeholder="Masukkan website desa" required/>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Upload Logo</label>
                <input type="file" class="form-control" accept="image/*" @change="handleFileUpload($event, 'logo')" />
                <img v-if="logoPreview" :src="logoPreview" alt="Logo Preview" class="image-preview mt-2" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Upload Foto Kantor</label>
                <input type="file" class="form-control" accept="image/*" @change="handleFileUpload($event, 'foto')" />
                <img v-if="fotoPreview" :src="fotoPreview" alt="Foto Preview" class="image-preview mt-2" />
              </div>
            </div>

            <div class="mb-3" v-for="(field, key) in textareaFields" :key="key">
              <label :for="key" class="form-label">{{ field.label }}</label>
              <textarea class="form-control" :id="key" :rows="field.rows" v-model="formData[key]"></textarea>
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

    <!-- Panggil Modal FilterRegion -->
    <div v-if="isRegionSelectorVisible" class="modal-overlay-selector">
      <div class="modal-content-selector">
        <div class="modal-header">
          <h5 class="modal-title">Pilih Wilayah</h5>
          <button type="button" class="btn-close" @click="closeRegionSelector"></button>
        </div>
        <div class="modal-body-selector">
          <FilterRegions @region-selected="handleRegionSelection" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterRegions from './filterRegions.vue';
import { addProfile, updateProfile } from '@/services/general/villageInformation/profile';
import { getDetailRegion } from '@/services/referensi/regions';
import { useToast } from "vue-toastification";

const initialFormData = {
  idwilayah: '', 
  logo: '',
  foto: '', 
  alamatkantor: '', 
  koordinat: '', 
  email: '', 
  website: '', 
  kodepos: '', 
  sejarah: '', 
  profildesa: '', 
  profilmasyarakat: '', 
  profilpotensi: '', 
  visimisi: '', 
  sambutankepaladesa: '',
};

export default {
  name: 'addEditProfilDesaModal',
  components: { FilterRegions },
  props: {
    profileToEdit: { type: Object, default: null }
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedLogoFile: null, 
      selectedFotoFile: null, 
      logoPreview: null,      
      fotoPreview: null,      
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
      isRegionSelectorVisible: false,
      selectedRegionName: '',
      textareaFields: {
        sambutankepaladesa: { label: 'Sambutan Kepala Desa', rows: 3 },
        sejarah: { label: 'Sejarah Desa', rows: 4 },
        visimisi: { label: 'Visi & Misi', rows: 4 },
        profildesa: { label: 'Profil Umum Desa', rows: 3 },
        profilmasyarakat: { label: 'Profil Masyarakat', rows: 3 },
        profilpotensi: { label: 'Profil Potensi Desa', rows: 3 },
      },
    };
  },
  computed: {
    isEditMode() {
      return !!this.profileToEdit;
    }
  },
  watch: {
    profileToEdit: {
      handler(newData) {
        if (newData) {
          this.formData = { ...initialFormData, ...newData };
          this.logoPreview = newData.logo || null; 
          this.fotoPreview = newData.foto || null;
          this.selectedLogoFile = null;
          this.selectedFotoFile = null;

          if (this.formData.idwilayah) {
            this.fetchRegionNameById(this.formData.idwilayah);
          }
        } else {
          this.formData = { ...initialFormData };
          this.selectedRegionName = '';
          this.selectedLogoFile = null;
          this.selectedFotoFile = null;
          this.logoPreview = null;
          this.fotoPreview = null;
        }
        this.errorMessage = null;
      },
      immediate: true,
      deep: true,
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
    openRegionSelector() { 
      this.isRegionSelectorVisible = true; 
    },
    closeRegionSelector() {
      this.isRegionSelectorVisible = false; 
    },

    handleRegionSelection(region) {
      this.formData.idwilayah = region.id;       
      this.selectedRegionName = region.name;    // Nampilin nama di input
      this.closeRegionSelector();
    },

    handleFileUpload(event, fieldName) {
      const file = event.target.files[0];
      if (!file) {
        console.log('Tidak ada file yang dipilih');
        return;
      }

      console.log('File yang dipilih:', file); 

      if (fieldName === 'logo') {
        this.selectedLogoFile = file;
        this.logoPreview = URL.createObjectURL(file);
      } else if (fieldName === 'foto') {
        this.selectedFotoFile = file;
        this.fotoPreview = URL.createObjectURL(file);
      }
    },

    async fetchRegionNameById(idwilayah) {
      if (!idwilayah) {
        this.selectedRegionName = 'Wilayah tidak ditemukan';
        return;
      }
      try {
        const response = await getDetailRegion(idwilayah);
        const regionData = response.data?.[0]?.data?.[0] || null;

        if (regionData && regionData.region_name) {
          this.selectedRegionName = regionData.region_name;
        } else {
          this.selectedRegionName = 'Nama wilayah tidak ditemukan';
          // console.warn('Properti "region_name" tidak ditemukan pada objek:', regionData);
        }

      } catch (error) {
        // console.error("Gagal mengambil nama wilayah:", error);
        this.selectedRegionName = 'Gagal memuat nama wilayah';
      }
    },

    async submitForm() {
      this.errorMessage = null;
      if (!this.formData.idwilayah || !this.formData.alamatkantor) {
          this.errorMessage = 'Nama Desa (Wilayah) dan Alamat Kantor wajib diisi.';
          return;
      }
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();
      
      data.append('act', 'profil-desa');
      if (this.selectedLogoFile) {
        data.append('upload_logo', this.selectedLogoFile);
      } else if (this.formData.logo) {
          data.append('record[logo]', this.formData.logo);
      }
      
      if (this.selectedFotoFile) {
          data.append('upload_foto', this.selectedFotoFile);
      } else if (this.formData.foto) {
          data.append('record[foto]', this.formData.foto);
      }

      const dataToSend = { ...this.formData };
      delete dataToSend.logo;
      delete dataToSend.foto;
      delete dataToSend.wilayah; 

      Object.keys(dataToSend).forEach(key => {
          const value = dataToSend[key];
          if (value !== null && value !== undefined && value !== '') {
              data.append(`record[${key}]`, value);
          }
      });

      try {
          if (this.isEditMode) {
              data.append('_method', 'PUT');
              await updateProfile(this.profileToEdit.iddesa, data);
              this.toast.success("Data profil desa berhasil diperbarui.");
          } else {
              await addProfile(data);
              this.toast.success("Data profil desa berhasil ditambah.");
          }
          this.$emit('save-successful');
          this.closeModal();
      } catch (error) {
          this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.';
          this.toast.error("Gagal menyimpan data profil desa.");

      } finally {
          this.isLoading = false;
      }
    }
  },
};
</script>

<style scoped>
.modal-overlay, .modal-overlay-selector {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050;
}
.modal-content, .modal-content-selector {
  background: white; border-radius: 8px; width: 90%; max-width: 1000px;
  max-height: 90vh; box-shadow: 0 5px 15px rgba(0,0,0,.5);
  display: flex; flex-direction: column;
}
.modal-header, .modal-footer {
  padding: 1rem; flex-shrink: 0;
}
.modal-body, .modal-body-selector {
  padding: 1rem; overflow-y: auto; flex-grow: 1;
}
.modal-header { 
  border-bottom: 1px solid #dee2e6; display: flex; 
  justify-content: space-between; align-items: center; 
}
.modal-footer { border-top: 1px solid #dee2e6; display: flex; 
  justify-content: flex-end; gap: 0.5rem; 
}
.image-preview { 
  max-width: 200px; max-height: 150px; border-radius: 6px; 
  border: 1px solid #ddd; object-fit: cover; 
}
.text-danger { color: #dc3545 !important; }
</style>