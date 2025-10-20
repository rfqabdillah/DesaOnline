<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Persil' : 'Tambah Data Persil' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Pemilik</label>
                <input type="text" class="form-control" v-model="formData.nama_pemilik" placeholder="Masukkan nama pemilik" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">NIK Pemilik</label>
                <input type="text" class="form-control" v-model="formData.nik_pemilik" placeholder="Masukkan NIK pemilik" required />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Desa</label>
                <select class="form-select" v-model="formData.id_desa" required :disabled="isListLoading || !isSuperadmin" >
                  <option disabled value="">
                    {{ isListLoading ? 'Memuat...' : 'Pilih Desa' }}
                  </option>
                  <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                    {{ desa.wilayah.namawilayah }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Nomor Letter C</label>
                <input type="text" class="form-control" v-model="formData.nomor_letter_c" placeholder="Masukkan nomor letter C" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nomor Persil</label>
                <input type="text" class="form-control" v-model="formData.nomor_persil" placeholder="Masukkan nomor persil" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Nomor Kohir</label>
                <input type="text" class="form-control" v-model="formData.nomor_kohir" placeholder="Masukkan nomor kohir" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Luas (m²)</label>
                <input type="number" class="form-control" v-model="formData.luas" placeholder="Contoh: 1500" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Koordinat</label>
                <input type="text" class="form-control" v-model="formData.koordinat" placeholder="Contoh: -7.123, 109.456" />
              </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Alamat / Lokasi Persil</label>
                <textarea class="form-control" v-model="formData.alamat" placeholder="Masukkan alamat atau lokasi persil" rows="2"></textarea>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Batas Tanah</label>
                <textarea class="form-control" v-model="formData.batas_tanah" placeholder="Sebutkan batas-batas tanah yang ada" rows="3"></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label">Riwayat Tanah</label>
                <textarea class="form-control" v-model="formData.riwayat_tanah" placeholder="Jelaskan riwayat kepemilikan tanah" rows="4"></textarea>
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
import { addParcel, updateParcel } from '@/services/general/landAffairs/parcels'; 
import { getProfiles } from '@/services/general/villageInformation/profile';
import { useToast } from "vue-toastification";

const initialFormData = {
  id_desa: '',
  nama_pemilik: '',
  nik_pemilik: '',
  nomor_letter_c: '',
  nomor_persil: '',
  nomor_kohir: '',
  luas: '',
  alamat: '',
  koordinat: '',
  batas_tanah: '',
  riwayat_tanah: '',
};

export default {
  name: 'addEditParcelModal',
  props: {
    parcelToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      desaList: [],
      isListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
      userRole: null, 
      userIdDesa: null, 
    };
  },
  computed: {
    isEditMode() {
      return !!this.parcelToEdit;
    },
    isSuperadmin() {
      return this.userRole === 'Superadmin';
    },
  },
  watch: {
    parcelToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.id_desa = newData.id_desa;
          this.formData.nama_pemilik = newData.nama_pemilik;
          this.formData.nik_pemilik = newData.nik_pemilik;
          this.formData.nomor_letter_c = newData.nomor_letter_c;
          this.formData.nomor_persil = newData.nomor_persil;
          this.formData.nomor_kohir = newData.nomor_kohir;
          this.formData.luas = newData.luas;
          this.formData.alamat = newData.alamat;
          this.formData.koordinat = newData.koordinat;
          this.formData.batas_tanah = newData.batas_tanah;
          this.formData.riwayat_tanah = newData.riwayat_tanah;
        } else {
          this.formData = { ...initialFormData };

          // Jika bukan superadmin, set iddesa saat form direset
          if (!this.isSuperadmin && !this.isEditMode && this.userIdDesa) {
            this.formData.iddesa = this.userIdDesa;
          }
        }
        this.errorMessage = null;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.loadUserData();
    this.fetchDesaList();
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

            // Jika bukan superadmin dan bukan mode edit, langsung set iddesa
            if (!this.isSuperadmin && !this.isEditMode) {
              this.formData.id_desa = this.userIdDesa;
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
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;
      const data = new FormData();

      data.append('record[id_desa]', this.formData.id_desa);
      data.append('record[nama_pemilik]', this.formData.nama_pemilik);
      data.append('record[nik_pemilik]', this.formData.nik_pemilik);
      data.append('record[nomor_letter_c]', this.formData.nomor_letter_c);
      data.append('record[nomor_persil]', this.formData.nomor_persil);
      data.append('record[nomor_kohir]', this.formData.nomor_kohir);
      data.append('record[luas]', this.formData.luas);
      data.append('record[alamat]', this.formData.alamat);
      data.append('record[koordinat]', this.formData.koordinat);
      data.append('record[batas_tanah]', this.formData.batas_tanah);
      data.append('record[riwayat_tanah]', this.formData.riwayat_tanah);
      
      try {
        let response;
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateParcel(this.parcelToEdit.id_persil, data);
          this.toast.success("Data persil berhasil diperbarui");
        } else {
          response = await addParcel(data);
          this.toast.success("Data persil berhasil ditambah");
        }
        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data persil");
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

.img-thumbnail {
  padding: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  height: auto;
}
</style>