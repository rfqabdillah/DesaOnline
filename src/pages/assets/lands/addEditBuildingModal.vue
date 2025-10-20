<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Bangunan' : 'Tambah Data Bangunan' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Berdiri di Atas Tanah</label>
              <input type="text" class="form-control" :value="landData?.namaaset || 'Memuat...'" disabled />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Bangunan</label>
                <input type="text" class="form-control" v-model="formData.namagedung" placeholder="Contoh: Kantor Desa" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Kode Aset</label>
                <input type="text" class="form-control" v-model="formData.kodeasetgedung" placeholder="Masukkan kode aset" required />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nomor Register</label>
                <input type="text" class="form-control" v-model="formData.nomorregistergedung" placeholder="Masukkan nomor register" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Alamat</label>
                <input type="text" class="form-control" v-model="formData.alamatgedung" placeholder="Masukkan alamat lokasi bangunan" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Luas Bangunan (m²)</label>
                <input type="number" class="form-control" v-model="formData.luas" placeholder="Contoh: 200" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Tahun Pengadaan</label>
                <input type="number" class="form-control" v-model="formData.tahunpengadaan" placeholder="YYYY" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Biaya Pengadaan (Rp)</label>
                <input type="number" class="form-control" v-model="formData.biayapengadaan" placeholder="Contoh: 500000000" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nomor Dokumen (IMB/PBG)</label>
                <input type="text" class="form-control" v-model="formData.nomordokumen" placeholder="Masukkan nomor dokumen" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Tanggal Dokumen</label>
                <input type="date" class="form-control" v-model="formData.tanggaldokumen" />
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Kondisi Bangunan</label>
                <select class="form-select" v-model="formData.idkondisi" required>
                  <option disabled value="">Pilih Kondisi</option>
                  <option v-for="item in kondisiList" :key="item.idkondisi" :value="item.idkondisi">{{ item.namakondisi }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Keberadaan Fisik</label>
                <select class="form-select" v-model="formData.idkeberadaanfisik" required>
                    <option disabled value="">Pilih Keberadaan Fisik</option>
                    <option v-for="item in keberadaanFisikList" :key="item.idkeberadaanfisik" :value="item.idkeberadaanfisik">{{ item.namakeberadaanfisik }}</option>
                </select>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                  <label class="form-label">Konstruksi Bertingkat</label>
                  <select class="form-select" v-model="formData.idkonstruksibertingkat" required>
                    <option disabled value="">Pilih Jenis</option>
                    <option v-for="item in konstruksiBertingkatList" :key="item.idkonstruksibertingkat" :value="item.idkonstruksibertingkat">{{ item.namakonstruksibertingkat }}</option>
                  </select>
              </div>
              <div class="col-md-6 mb-3">
                  <label class="form-label">Konstruksi Beton</label>
                  <select class="form-select" v-model="formData.idkonstruksibeton" required>
                    <option disabled value="">Pilih Jenis</option>
                    <option v-for="item in konstruksiBetonList" :key="item.idkonstruksibeton" :value="item.idkonstruksibeton">{{ item.namakonstruksibeton }}</option>
                  </select>
              </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Perolehan</label>
                    <select class="form-select" v-model="formData.idperolehan" required>
                      <option disabled value="">Pilih Perolehan</option>
                      <option v-for="item in perolehanList" :key="item.idperolehan" :value="item.idperolehan">{{ item.namaperolehan }}</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Sumber Anggaran</label>
                    <select class="form-select" v-model="formData.idsumberanggaran" required>
                      <option disabled value="">Pilih Sumber Anggaran</option>
                      <option v-for="item in sumberAnggaranList" :key="item.idsumberanggaran" :value="item.idsumberanggaran">{{ item.namasumberanggaran }}</option>
                    </select>
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

            <div class="mb-3">
              <label class="form-label">Keterangan</label>
              <textarea class="form-control" v-model="formData.keterangan" rows="3" placeholder="Tambahkan keterangan jika ada"></textarea>
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
import { addBuilding, updateBuilding } from '@/services/general/assets/buildings'; 
import { getAcquisitions } from '@/services/referensi/acquisitions';
import { getBudgetSources } from '@/services/referensi/budgetSources';
import { getConcreteConstructions } from '@/services/referensi/concreteConstruction';
import { getConditions } from '@/services/referensi/conditions';
import { getMultiStoryConstructions } from '@/services/referensi/multiStoryConstruction';
import { getPhysicalStatuses } from '@/services/referensi/physicalStatus';
import { useToast } from "vue-toastification";
import MapDrawerModal from '@/components/form/mapDrawerModal.vue';

const initialFormData = {
  iddesa: '',
  idtanah: '',
  idkonstruksibertingkat: '',
  idkonstruksibeton: '',
  idkondisi: '',
  idkeberadaanfisik: '',
  idsumberanggaran: '',
  idperolehan: '',
  kodeasetgedung: '',
  nomorregistergedung: '',
  tahunpengadaan: '',
  biayapengadaan: '',
  luas: '',
  alamatgedung: '',
  tanggaldokumen: '',
  nomordokumen: '',
  keterangan: '',
  foto: null,
  geojson: '',
  namagedung: '',
};

export default {
  name: 'addEditBuildingModal', 
  components: { 
    MapDrawerModal,
  },
  props: {
    buildingToEdit: { type: Object, default: null },
    landData: { type: Object, required: true },
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedFotoFile: null,
      fotoPreviewUrl: null, 
      kondisiList: [],
      konstruksiBertingkatList: [],
      konstruksiBetonList: [],
      keberadaanFisikList: [],
      sumberAnggaranList: [],
      perolehanList: [],
      isListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
      showMapDrawer: false,
    };
  },
  computed: {
    isEditMode() {
      return !!this.buildingToEdit;
    }
  },
  watch: {
    buildingToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.iddesa = newData.iddesa;
          this.formData.idtanah = newData.idtanah;
          this.formData.kodeasetgedung = newData.kodeasetgedung;
          this.formData.nomorregistergedung = newData.nomorregistergedung;
          this.formData.tahunpengadaan = newData.tahunpengadaan;
          this.formData.biayapengadaan = newData.biayapengadaan;
          this.formData.idkondisi = newData.idkondisi;
          this.formData.idkonstruksibertingkat = newData.idkonstruksibertingkat;
          this.formData.idkonstruksibeton = newData.idkonstruksibeton;
          this.formData.luas = newData.luas;
          this.formData.alamatgedung = newData.alamatgedung;
          this.formData.tanggaldokumen = newData.tanggaldokumen;
          this.formData.nomordokumen = newData.nomordokumen;
          this.formData.idkeberadaanfisik = newData.idkeberadaanfisik;
          this.formData.idsumberanggaran = newData.idsumberanggaran;
          this.formData.idperolehan = newData.idperolehan;
          this.formData.keterangan = newData.keterangan;
          this.formData.foto = newData.foto;
          this.formData.geojson = newData.geojson;
          this.formData.namagedung = newData.namagedung;
        } else {
          this.formData = { ...initialFormData };
          if (this.landData) {
            this.formData.iddesa = this.landData.iddesa;
            this.formData.idtanah = this.landData.idtanah;
          }
        }
        this.selectedFotoFile = null;
        this.fotoPreviewUrl = null;
        this.errorMessage = null;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.fetchKondisiList(), 
    this.fetchKonstruksiBertingkatList(), 
    this.fetchKonstruksiBetonList(), 
    this.fetchKeberadaanFisikList(), 
    this.fetchSumberAnggaranList(), 
    this.fetchPerolehanList()
  },
  beforeUnmount() {
    if (this.fotoPreviewUrl) {
      URL.revokeObjectURL(this.fotoPreviewUrl);
    }
  },
  methods: {
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
    async fetchKondisiList() {
      try {
        const response = await getConditions({ limit: -1 });
        this.kondisiList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) { this.toast.error("Gagal memuat daftar kondisi"); }
    },
    async fetchPerolehanList() {
      try {
        const response = await getAcquisitions({ limit: -1 });
        this.perolehanList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) { this.toast.error("Gagal memuat daftar perolehan"); }
    },
    async fetchSumberAnggaranList() {
      try {
        const response = await getBudgetSources({ limit: -1 });
        this.sumberAnggaranList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) { this.toast.error("Gagal memuat daftar sumber anggaran"); }
    },
    async fetchKonstruksiBertingkatList() {
      try {
        const response = await getMultiStoryConstructions({ limit: -1 });
        this.konstruksiBertingkatList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) { this.toast.error("Gagal memuat daftar konstruksi bertingkat"); }
    },
    async fetchKonstruksiBetonList() {
      try {
        const response = await getConcreteConstructions({ limit: -1 });
        this.konstruksiBetonList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) { this.toast.error("Gagal memuat daftar konstruksi beton"); }
    },
    async fetchKeberadaanFisikList() {
      try {
        const response = await getPhysicalStatuses({ limit: -1 });
        this.keberadaanFisikList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) { this.toast.error("Gagal memuat daftar keberadaan fisik"); }
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

      data.append('record[idtanah]', this.formData.idtanah);
      data.append('record[iddesa]', this.formData.iddesa);
      data.append('record[kodeasetgedung]', this.formData.kodeasetgedung);
      data.append('record[nomorregistergedung]', this.formData.nomorregistergedung);
      data.append('record[tahunpengadaan]', this.formData.tahunpengadaan);
      data.append('record[biayapengadaan]', this.formData.biayapengadaan);
      data.append('record[idkondisi]', this.formData.idkondisi);
      data.append('record[idkonstruksibertingkat]', this.formData.idkonstruksibertingkat);
      data.append('record[idkonstruksibeton]', this.formData.idkonstruksibeton);
      data.append('record[luas]', this.formData.luas);
      data.append('record[alamatgedung]', this.formData.alamatgedung);
      data.append('record[tanggaldokumen]', this.formData.tanggaldokumen);
      data.append('record[nomordokumen]', this.formData.nomordokumen);
      data.append('record[idkeberadaanfisik]', this.formData.idkeberadaanfisik);
      data.append('record[idsumberanggaran]', this.formData.idsumberanggaran);
      data.append('record[idperolehan]', this.formData.idperolehan);
      data.append('record[keterangan]', this.formData.keterangan);
      data.append('record[geojson]', this.formData.geojson);
      data.append('record[namagedung]', this.formData.namagedung);
      
      if (this.selectedFotoFile) {
        data.append('upload_foto', this.selectedFotoFile);
      }
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateBuilding(this.buildingToEdit.idgedung, data);
          this.toast.success("Data bangunan berhasil diperbarui");
        } else {
          response = await addBuilding(data);
          this.toast.success("Data bangunan berhasil ditambah");
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