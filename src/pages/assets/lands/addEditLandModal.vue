<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Tanah' : 'Tambah Data Tanah' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Desa</label>
                <select class="form-select" v-model="formData.iddesa" required :disabled="isListLoading || !isSuperadmin">
                  <option disabled value="">
                    {{ isListLoading ? 'Memuat...' : 'Pilih Desa' }}
                  </option>
                  <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                    {{ desa.wilayah.namawilayah }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Kode Aset</label>
                <input type="text" class="form-control" v-model="formData.kodeaset" placeholder="Masukkan kode aset" required />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nomor Register</label>
                <input type="text" class="form-control" v-model="formData.nomorregister" placeholder="Masukkan nomor register" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Aset/Barang</label>
                <input type="text" class="form-control" v-model="formData.namaaset" placeholder="Contoh: Tanah Kas Desa" required />
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Luas (m²)</label>
                <input type="number" class="form-control" v-model="formData.luas" placeholder="Contoh: 1500" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Tahun Pengadaan</label>
                <input type="number" class="form-control" v-model="formData.tahunpengadaan" placeholder="YYYY" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Alamat</label>
                <input type="text" class="form-control" v-model="formData.alamat" placeholder="Masukkan alamat lokasi tanah" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Tanggal Sertifikat</label>
                <input type="date" class="form-control" v-model="formData.tanggalsertifikat" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Nomor Sertifikat</label>
                <input type="text" class="form-control" v-model="formData.nomorsertifikat" placeholder="Masukkan nomor sertifikat" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Penggunaan</label>
                <input type="text" class="form-control" v-model="formData.penggunaan" placeholder="Contoh: Pertanian, Perkantoran" />
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Harga Perolehan (Rp)</label>
                <input type="number" class="form-control" v-model="formData.hargaperolehan" placeholder="Contoh: 150000000" required />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Status Hak</label>
                <select class="form-select" v-model="formData.idstatushak" required>
                  <option disabled value="">Pilih Status Hak</option>
                  <option v-for="item in StatusHakList" :key="item.idstatushak" :value="item.idstatushak">{{ item.namastatushak }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Asal Usul Tanah</label>
                <select class="form-select" v-model="formData.idasalusultanah" required>
                  <option disabled value="">Pilih Asal Usul</option>
                  <option v-for="item in asalUsulTanahList" :key="item.idasalusultanah" :value="item.idasalusultanah">{{ item.namaasalusultanah }}</option>
                </select>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                  <label class="form-label">Prosedur Penguasaan</label>
                  <select class="form-select" v-model="formData.idprosedurpenguasaan" required>
                    <option disabled value="">Pilih Prosedur Penguasaan</option>
                    <option v-for="item in prosedurPenguasaanList" :key="item.idprosedurpenguasaan" :value="item.idprosedurpenguasaan">{{ item.namaprosedurpenguasaan }}</option>
                  </select>
              </div>
              <div class="col-md-6 mb-3">
                  <label class="form-label">Perolehan</label>
                  <select class="form-select" v-model="formData.idperolehan" required>
                  <option disabled value="">Pilih Perolehan</option>
                  <option v-for="item in perolehanList" :key="item.idperolehan" :value="item.idperolehan">{{ item.namaperolehan }}</option>
                  </select>
              </div>
            </div>

            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="form-label">Sumber Anggaran</label>
                    <select class="form-select" v-model="formData.idsumberanggaran" required>
                    <option disabled value="">Pilih Sumber Anggaran</option>
                    <option v-for="item in sumberAnggaranList" :key="item.idsumberanggaran" :value="item.idsumberanggaran">{{ item.namasumberanggaran }}</option>
                    </select>
                </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Keterangan</label>
              <textarea class="form-control" v-model="formData.keterangan" rows="3" placeholder="Tambahkan keterangan jika ada"></textarea>
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

            <div class="mb-3">
              <label class="form-label">Upload Foto</label>
              <input type="file" class="form-control" accept="image/*" @change="handleFotoUpload" />
              <div class="mt-2">
                <div v-if="fotoPreviewUrl">
                  <img :src="fotoPreviewUrl" alt="Preview Foto" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
                <div v-else-if="isEditMode && formData.foto">
                  <img :src="formData.foto" alt="Foto Saat Ini" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
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
    <map-drawer-modal
      v-if="showMapDrawer"
      :initialGeoJSON="formData.geojson"
      @close="closeMapDrawer"
      @save="handleMapSave"
    />
  </div>
</template>

<script>
import { addLand, updateLand } from '@/services/general/assets/lands'; 
import { getProfiles } from '@/services/general/villageInformation/profile';
import { getAcquisitionProcedures } from '@/services/referensi/acquisitionProcedures';
import { getAcquisitions } from '@/services/referensi/acquisitions';
import { getBudgetSources } from '@/services/referensi/budgetSources';
import { getLandOrigins } from '@/services/referensi/landOrigins';
import { getLegalStatuses } from '@/services/referensi/legalStatus';
import { useToast } from "vue-toastification";
import MapDrawerModal from '@/components/form/mapDrawerModal.vue';


const initialFormData = {
  iddesa: '',
  idstatushak: '',
  idasalusultanah: '', 
  idprosedurpenguasaan: '',
  idperolehan: '',
  idsumberanggaran: '',
  kodeaset: '',
  nomorregister: '',
  namaaset: '',
  luas: '',
  tahunpengadaan: '',
  alamat: '',
  geojson: '',
  tanggalsertifikat: '',
  nomorsertifikat: '',
  penggunaan: '',
  hargaperolehan: '',
  keterangan: '',
  foto: null,
};

export default {
  name: 'addEditLandModal', 
  components: { 
    MapDrawerModal,
  },
  props: {
    landToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedFotoFile: null,
      fotoPreviewUrl: null, 
      desaList: [],
      StatusHakList: [],
      asalUsulTanahList: [],
      prosedurPenguasaanList: [],
      perolehanList: [],
      sumberAnggaranList: [],
      isListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
      userRole: null, 
      userIdDesa: null, 
      showMapDrawer: false,
    };
  },
  computed: {
    isEditMode() {
      return !!this.landToEdit;
    },
    isSuperadmin() {
      return this.userRole === 'Superadmin';
    },
  },
  watch: {
    landToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.iddesa = newData.iddesa;
          this.formData.idstatushak = newData.idstatushak;
          this.formData.idasalusultanah = newData.idasalusultanah;
          this.formData.idprosedurpenguasaan = newData.idprosedurpenguasaan;
          this.formData.idperolehan = newData.idperolehan;
          this.formData.idsumberanggaran = newData.idsumberanggaran;
          this.formData.kodeaset = newData.kodeaset;
          this.formData.nomorregister = newData.nomorregister;
          this.formData.namaaset = newData.namaaset;
          this.formData.luas = newData.luas;
          this.formData.tahunpengadaan = newData.tahunpengadaan;
          this.formData.alamat = newData.alamat;
          this.formData.geojson = newData.geojson;
          this.formData.tanggalsertifikat = newData.tanggalsertifikat;
          this.formData.nomorsertifikat = newData.nomorsertifikat;
          this.formData.penggunaan = newData.penggunaan;
          this.formData.hargaperolehan = newData.hargaperolehan;
          this.formData.keterangan = newData.keterangan;
          this.formData.foto = newData.foto;
        } else {
          this.formData = { ...initialFormData };
          if (!this.isSuperadmin && !this.isEditMode && this.userIdDesa) {
            this.formData.iddesa = this.userIdDesa;
          }
        }
        this.selectedFotoFile = null;
        this.fotoPreviewUrl = null;
        this.errorMessage = null;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.loadUserData();
    this.fetchDesaList();
    this.fetchStatusHakList(); 
    this.fetchAsalUsulTanahList(); 
    this.fetchProsedurPenguasaanList(); 
    this.fetchPerolehanList(); 
    this.fetchSumberAnggaranList(); 
  },
  beforeUnmount() {
    if (this.fotoPreviewUrl) {
      URL.revokeObjectURL(this.fotoPreviewUrl);
    }
  },
  methods: {
    loadUserData() {
      try {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const userProfile = userData?.data?.[0];
          if (userProfile) {
            this.userRole = userProfile.role?.nama_level;
            this.userIdDesa = userProfile.id_desa;

            if (!this.isSuperadmin && !this.isEditMode) {
              this.formData.iddesa = this.userIdDesa;
            }
          }
        }
      } catch (error) {
        console.error("Gagal membaca data pengguna dari localStorage:", error);
        this.toast.error("Gagal memuat informasi pengguna.");
      }
    },
    closeModal() {
      this.$emit('close');
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
    async fetchStatusHakList() {
      this.isListLoading = true;
      try {
        const response = await getLegalStatuses({ limit: -1 });
        this.StatusHakList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar status hak");
      } finally {
        this.isListLoading = false;
      }
    },
    async fetchPerolehanList() {
      this.isListLoading = true;
      try {
        const response = await getAcquisitions({ limit: -1 });
        this.perolehanList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar perolehan");
      } finally {
        this.isListLoading = false;
      }
    },
    async fetchSumberAnggaranList() {
      this.isListLoading = true;
      try {
        const response = await getBudgetSources({ limit: -1 });
        this.sumberAnggaranList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar sumber anggaran");
      } finally {
        this.isListLoading = false;
      }
    },
    async fetchAsalUsulTanahList() {
      this.isListLoading = true;
      try {
        const response = await getLandOrigins({ limit: -1 });
        this.asalUsulTanahList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar asal-usul tanah");
      } finally {
        this.isListLoading = false;
      }
    },
    async fetchProsedurPenguasaanList() {
      this.isListLoading = true;
      try {
        const response = await getAcquisitionProcedures({ limit: -1 });
        this.prosedurPenguasaanList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar prosedur penguasaan");
      } finally {
        this.isListLoading = false;
      }
    },
    handleFotoUpload(event) {
      const file = event.target.files[0];

      if (this.fotoPreviewUrl) {
        URL.revokeObjectURL(this.fotoPreviewUrl);
      }

      if (!file) {
        this.selectedFotoFile = null;
        this.fotoPreviewUrl = null;
        return;
      }
      this.selectedFotoFile = file;
      this.fotoPreviewUrl = URL.createObjectURL(file);
    },
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();

      data.append('record[iddesa]', this.formData.iddesa);
      data.append('record[idstatushak]', this.formData.idstatushak);
      data.append('record[idasalusultanah]', this.formData.idasalusultanah); // Ditambahkan
      data.append('record[idprosedurpenguasaan]', this.formData.idprosedurpenguasaan);
      data.append('record[idperolehan]', this.formData.idperolehan);
      data.append('record[idsumberanggaran]', this.formData.idsumberanggaran);
      data.append('record[kodeaset]', this.formData.kodeaset);
      data.append('record[nomorregister]', this.formData.nomorregister);
      data.append('record[namaaset]', this.formData.namaaset);
      data.append('record[luas]', this.formData.luas);
      data.append('record[tahunpengadaan]', this.formData.tahunpengadaan);
      data.append('record[alamat]', this.formData.alamat);
      data.append('record[geojson]', this.formData.geojson);
      data.append('record[tanggalsertifikat]', this.formData.tanggalsertifikat);
      data.append('record[nomorsertifikat]', this.formData.nomorsertifikat);
      data.append('record[penggunaan]', this.formData.penggunaan);
      data.append('record[hargaperolehan]', this.formData.hargaperolehan);
      data.append('record[keterangan]', this.formData.keterangan);
      
      if (this.selectedFotoFile) {
        data.append('upload_foto', this.selectedFotoFile);
      }
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateLand(this.landToEdit.idtanah, data);
          this.toast.success("Data tanah berhasil diperbarui");
        } else {
          response = await addLand(data);
          this.toast.success("Data tanah berhasil ditambah");
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
  background: white; border-radius: 8px; width: 90%; max-width: 1000px;
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

.img-thumbnail {
  padding: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  height: auto;
}
</style>