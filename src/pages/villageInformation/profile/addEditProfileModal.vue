<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Profil Desa' : 'Tambah Data Profil Desa' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

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
                  :disabled="!isSuperadmin" 
                  required
                />
                <button v-if="isSuperadmin" type="button" class="btn btn-primary" @click="openRegionSelector">
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

            <div class="mb-3">
              <label class="form-label">Data GeoJSON</label>
              <div class="geojson-wrapper">
                <textarea
                  class="form-control flex-grow-1"
                  v-model="formData.geojson"
                  rows="3"
                  placeholder="Data koordinat akan muncul di sini"
                  aria-label="Data GeoJSON"
                  disabled
                ></textarea>
                <button
                  class="btn btn-primary geojson-btn"
                  type="button"
                  @click="openMapDrawer"
                >
                  <i class="fa fa-map me-2"></i>
                  Edit Koordinat / Digitasi
                </button>
              </div>
            </div>

            <div class="mb-3" v-for="(field, key) in textareaFields" :key="key">
              <label :for="key" class="form-label">{{ field.label }}</label>
              <div class="quill-editor-container">
                <QuillEditor
                  :id="key"
                  theme="snow"
                  toolbar="essential"
                  v-model:content="formData[key]"
                  contentType="html"
                  :placeholder="`Masukkan ${field.label}`"
                />
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
    <map-drawer-modal
      v-if="showMapDrawer"
      :initialGeoJSON="formData.geojson"
      @close="closeMapDrawer"
      @save="handleMapSave"
    />
  </div>
</template>

<script>
import FilterRegions from './filterRegions.vue';
import { addProfile, updateProfile, getProfiles } from '@/services/general/villageInformation/profile';
import { useToast } from "vue-toastification";
import { QuillEditor } from '@vueup/vue-quill';
import MapDrawerModal from '@/components/form/mapDrawerModal.vue';

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
  components: { FilterRegions, QuillEditor, MapDrawerModal },
  props: {
    profileToEdit: { type: Object, default: null }
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedLogoFile: null, selectedFotoFile: null, logoPreview: null, fotoPreview: null, isLoading: false, errorMessage: null,
      toast: useToast(),
      userRole: null, 
      userIdDesa: null, 
      isRegionSelectorVisible: false,
      selectedRegionName: '',
      textareaFields: {
        sambutankepaladesa: { label: 'Sambutan Kepala Desa' },
        sejarah: { label: 'Sejarah Desa' },
        visimisi: { label: 'Visi & Misi' },
        profildesa: { label: 'Profil Umum Desa' },
        profilmasyarakat: { label: 'Profil Masyarakat' },
        profilpotensi: { label: 'Profil Potensi Desa' },
      },
      showMapDrawer: false,
    };
  },
  computed: {
    isEditMode() {
      return !!this.profileToEdit;
    },
    isSuperadmin() {
      return this.userRole === 'Superadmin';
    },
  },
  watch: {
    profileToEdit: {
      handler(newData) {
        if (newData) {
          this.populateFormWithData(newData);
        }
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.initializeComponent();
  },
  methods: {
    async initializeComponent() {
      this.loadUserData();
      
      if (this.isEditMode) {

      } else { 
        this.resetForm();
        if (!this.isSuperadmin) {
          await this.prefillOperatorData();
        }
      }
    },
    loadUserData() {
      try {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
          const userProfile = JSON.parse(userDataString)?.data?.[0];
          if (userProfile) {
            this.userRole = userProfile.role?.nama_level;
            this.userIdDesa = userProfile.id_desa;
          }
        }
      } catch (error) {
        console.error("Gagal membaca data pengguna dari localStorage:", error);
      }
    },
    async prefillOperatorData() {
        if (!this.userIdDesa) return;
        this.isLoading = true;
        try {
            const response = await getProfiles({ filter: `iddesa=${this.userIdDesa}`});
            const operatorProfile = response.data?.data?.[0] || response.data?.[0]?.data?.[0];

            if (operatorProfile) {
                this.populateFormWithData(operatorProfile);
            } else {
                this.toast.warn("Profil desa untuk operator tidak ditemukan.");
            }
        } catch (error) {
            this.toast.error("Gagal memuat data profil desa untuk operator.");
        } finally {
            this.isLoading = false;
        }
    },
    populateFormWithData(data) {
        this.formData = { ...initialFormData, ...data };
        this.logoPreview = data.logo || null;
        this.fotoPreview = data.foto || null;
        if (data.wilayah?.namawilayah) {
            this.selectedRegionName = data.wilayah.namawilayah;
        } else if(data.idwilayah) {
            this.selectedRegionName = `Wilayah ID: ${data.idwilayah}`;
        }
    },
    resetForm() {
        this.formData = { ...initialFormData };
        this.selectedRegionName = '';
        this.selectedLogoFile = null;
        this.selectedFotoFile = null;
        this.logoPreview = null;
        this.fotoPreview = null;
        this.errorMessage = null;
    },
    closeModal() { 
      this.$emit('close'); 
    },
    handleOverlayClick(e) { 
      if (e.target === e.currentTarget) 
        this.closeModal(); 
    },
    openMapDrawer() {
      this.showMapDrawer = true;
    },
    closeMapDrawer() {
      this.showMapDrawer = false;
    },
    handleMapSave(newGeoJSON) {
      this.formData.geojson = newGeoJSON;
      this.closeMapDrawer(); 
    },
    openRegionSelector() { 
      this.isRegionSelectorVisible = true; 
    },
    closeRegionSelector() { 
      this.isRegionSelectorVisible = false; 
    },
    handleRegionSelection(region) {
      this.formData.idwilayah = region.id;      
      this.selectedRegionName = region.name;    
      this.closeRegionSelector();
    },
    handleFileUpload(event, fieldName) {
      const file = event.target.files[0];
      if (!file) return;

      if (fieldName === 'logo') {
        this.selectedLogoFile = file;
        this.logoPreview = URL.createObjectURL(file);
      } else if (fieldName === 'foto') {
        this.selectedFotoFile = file;
        this.fotoPreview = URL.createObjectURL(file);
      }
    },
    async submitForm() {
      if (!this.formData.idwilayah) {
          this.errorMessage = 'Nama Desa (Wilayah) wajib diisi.';
          return;
      }
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();
      
      Object.keys(this.formData).forEach(key => {
          if (this.formData[key] && key !== 'logo' && key !== 'foto' && key !== 'wilayah') {
            data.append(`record[${key}]`, this.formData[key]);
          }
      });

      if (this.selectedLogoFile) { 
        data.append('upload_logo', this.selectedLogoFile); 
      }
      if (this.selectedFotoFile) { 
        data.append('upload_foto', this.selectedFotoFile); 
      }
      
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
          this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data.';
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
.text-danger { 
color: #dc3545 !important; 
}
.geojson-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.geojson-btn {
  height: 38px; 
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  font-weight: 400;
}
.geojson-btn i {
  font-size: 1rem;
}
.quill-editor-container {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
.quill-editor-container:focus-within {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
:deep(.ql-toolbar) {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  border: none !important;
  border-bottom: 1px solid #dee2e6 !important;
}
:deep(.ql-container) {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  border: none !important;
}
:deep(.ql-editor) {
  min-height: 150px; 
  padding: 0.5rem 1rem;
}
</style>