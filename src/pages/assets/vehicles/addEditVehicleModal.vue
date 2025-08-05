<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Kendaraan' : 'Tambah Data Kendaraan' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-6 mb-3">
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
                <label class="form-label">Nama Barang</label>
                <input type="text" class="form-control" v-model="formData.namabarang" placeholder="Contoh: Sepeda Motor" required />
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Merk / Tipe</label>
                <input type="text" class="form-control" v-model="formData.merk" placeholder="Contoh: Honda Vario" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Ukuran Silinder (CC)</label>
                <input type="text" class="form-control" v-model="formData.ukuransilinder" placeholder="Contoh: 150" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Bahan Bakar</label>
                <input type="text" class="form-control" v-model="formData.bahanbakar" placeholder="Contoh: Bensin" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Nomor Mesin</label>
                <input type="text" class="form-control" v-model="formData.nomormesin" placeholder="Masukkan nomor mesin" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Nomor Rangka</label>
                <input type="text" class="form-control" v-model="formData.nomorrangka" placeholder="Masukkan nomor rangka" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Nomor Polisi</label>
                <input type="text" class="form-control" v-model="formData.nomorpolisi" placeholder="Contoh: AA 1234 BCD" />
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Tahun Pembuatan</label>
                <input type="number" class="form-control" v-model="formData.tahunpembuatan" placeholder="YYYY" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Tahun Pembelian</label>
                <input type="number" class="form-control" v-model="formData.tahunpembelian" placeholder="YYYY" required />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Harga Pembelian (Rp)</label>
                <input type="number" class="form-control" v-model="formData.hargapembelian" placeholder="Contoh: 15000000" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Kondisi</label>
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
  </div>
</template>

<script>
import { addVehicle, updateVehicle } from '@/services/general/assets/vehicles'; 
import { getProfiles } from '@/services/general/villageInformation/profile';
import { getAcquisitions } from '@/services/referensi/acquisitions';
import { getBudgetSources } from '@/services/referensi/budgetSources';
import { getConditions } from '@/services/referensi/conditions';
import { getPhysicalStatuses } from '@/services/referensi/physicalStatus';
import { useToast } from "vue-toastification";

const initialFormData = {
  iddesa: '',
  idkeberadaanfisik: '',
  idkondisi: '',
  idperolehan: '',
  idsumberanggaran: '',
  kodeaset: '',
  nomorregister: '',
  namabarang: '',
  merk: '',
  ukuransilinder: '',
  bahanbakar: '',
  tahunpembuatan: '',
  nomormesin: '',
  nomorrangka: '',
  nomorpolisi: '',
  tahunpembelian: '',
  hargapembelian: '',
  keterangan: '',
  foto: null,
};

export default {
  name: 'addEditProfileModal',
  props: {
    vehicleToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedFotoFile: null,
      fotoPreviewUrl: null, 
      desaList: [],
      keberadaanFisikList: [],
      kondisiList: [],
      perolehanList: [],
      sumberAnggaranList: [],
      isListLoading: false,
      isBusinessFieldsLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.vehicleToEdit;
    }
  },
  watch: {
    vehicleToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.iddesa = newData.iddesa;
          this.formData.idkeberadaanfisik = newData.idkeberadaanfisik;
          this.formData.idkondisi = newData.idkondisi;
          this.formData.idperolehan = newData.idperolehan;
          this.formData.idsumberanggaran = newData.idsumberanggaran;
          this.formData.kodeaset = newData.kodeaset;
          this.formData.nomorregister = newData.nomorregister;
          this.formData.namabarang = newData.namabarang;
          this.formData.merk = newData.merk;
          this.formData.ukuransilinder = newData.ukuransilinder;
          this.formData.bahanbakar = newData.bahanbakar;
          this.formData.tahunpembuatan = newData.tahunpembuatan;
          this.formData.nomormesin = newData.nomormesin;
          this.formData.nomorrangka = newData.nomorrangka;
          this.formData.nomorpolisi = newData.nomorpolisi;
          this.formData.tahunpembelian = newData.tahunpembelian;
          this.formData.hargapembelian = newData.hargapembelian;
          this.formData.keterangan = newData.keterangan;
          this.formData.foto = newData.foto;
        } else {
          this.formData = { ...initialFormData };
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
    this.fetchDesaList();
    this.fetchKeberadaanFisikList(); 
    this.fetchkondisiList(); 
    this.fetchPerolehanList(); 
    this.fetchSumberAnggaranList(); 
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
    async fetchKeberadaanFisikList() {
      this.isListLoading = true;
      try {
        const response = await getPhysicalStatuses({ limit: -1 });
        this.keberadaanFisikList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar keberadaan fisik");
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
    async fetchkondisiList() {
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
      data.append('record[idkeberadaanfisik]', this.formData.idkeberadaanfisik);
      data.append('record[idkondisi]', this.formData.idkondisi);
      data.append('record[idperolehan]', this.formData.idperolehan);
      data.append('record[idsumberanggaran]', this.formData.idsumberanggaran);
      data.append('record[kodeaset]', this.formData.kodeaset);
      data.append('record[nomorregister]', this.formData.nomorregister);
      data.append('record[namabarang]', this.formData.namabarang);
      data.append('record[merk]', this.formData.merk);
      data.append('record[ukuransilinder]', this.formData.ukuransilinder);
      data.append('record[bahanbakar]', this.formData.bahanbakar);
      data.append('record[tahunpembuatan]', this.formData.tahunpembuatan);
      data.append('record[nomormesin]', this.formData.nomormesin);
      data.append('record[nomorrangka]', this.formData.nomorrangka);
      data.append('record[nomorpolisi]', this.formData.nomorpolisi);
      data.append('record[tahunpembelian]', this.formData.tahunpembelian);
      data.append('record[hargapembelian]', this.formData.hargapembelian);
      data.append('record[keterangan]', this.formData.keterangan);
      if (this.selectedFotoFile) {
        data.append('upload_foto', this.selectedFotoFile);
      }
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateVehicle(this.vehicleToEdit.idkendaraan, data);
          this.toast.success("Data kendaraan berhasil diperbarui");
        } else {
          response = await addVehicle(data);
          this.toast.success("Data kendaraan berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data kendaraan");
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
.text-danger { 
  color: #dc3545 !important; 
}

.img-thumbnail {
  padding: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  height: auto;
}
</style>