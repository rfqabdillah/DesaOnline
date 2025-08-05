<template>
  <div>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">Detail Data Penduduk</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Memuat data...</p>
          </div>

          <div v-else-if="error" class="text-center p-5 text-danger">
            <i class="fa fa-exclamation-triangle fa-3x mb-3"></i>
            <h4>Terjadi Kesalahan</h4>
            <p>{{ error }}</p>
          </div>

          <div v-else-if="penduduk" class="profile-container">
            <div class="text-center mb-4">
              <h2 class="penduduk mt-3">{{ penduduk.nama || 'Nama Tidak Tersedia' }}</h2>
              <p class="nik">
                NIK: {{ penduduk.nik || '-' }}
              </p>
            </div>
            
            <hr>

            <div class="detail-section">
              <h4><i class="fa fa-user-circle me-2"></i>Data Diri</h4>
              <div class="row">
                <div class="col-md-6 detail-item">
                  <label>Tempat, Tanggal Lahir</label>
                  <span>{{ [penduduk.tempatlahir, formatTanggal(penduduk.tanggallahir)].filter(Boolean).join(', ') || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Jenis Kelamin</label>
                  <span>{{ penduduk.jk?.namajeniskelamin || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Agama</label>
                  <span>{{ penduduk.agama?.namaagama || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Golongan Darah</label>
                  <span>{{ penduduk.darah?.namagolongandarah || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Status Perkawinan</label>
                  <span>{{ penduduk.perkawinan?.namastatusperkawinan || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Hubungan Keluarga</label>
                  <span>{{ penduduk.hubungan?.namahubungankeluarga || '-' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fa fa-map-marker me-2"></i>Data Alamat</h4>
              <div class="row">
                <div class="col-md-6 detail-item">
                  <label>Desa</label>
                  <span>{{ penduduk.wilayah?.namawilayah || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Dusun</label>
                  <span>{{ penduduk.dusun?.namadusun || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>RW</label>
                  <span>{{ penduduk.rw?.namarw || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>RT</label>
                  <span>{{ penduduk.rt?.namart || '-' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fa fa-briefcase me-2"></i>Pendidikan & Pekerjaan</h4>
              <div class="row">
                <div class="col-md-6 detail-item">
                  <label>Pendidikan Terakhir</label>
                  <span>{{ penduduk.pendidikan?.namapendidikan || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Pekerjaan</label>
                  <span>{{ penduduk.pekerjaan?.namapekerjaan || '-' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fa fa-whatsapp me-2"></i>Kontak</h4>
              <div class="row">
                <div class="col-md-6 detail-item">
                  <label>Nomor WhatsApp</label>
                  <span>{{ penduduk.whatsapp || '-' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fa fa-child me-2"></i>Data Kelahiran</h4>
              <div class="row">
                <div class="col-md-6 detail-item">
                  <label>Tempat Dilahirkan</label>
                  <span>{{ penduduk.tempatkelahiran?.namatempatdilahirkan || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Penolong Kelahiran</label>
                  <span>{{ penduduk.penolong?.namapenolongkelahiran || '-' }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetailResident } from '@/services/general/population/residents'; 

export default {
  name: 'DetailResidentModal',
  props: {
    residentToView: { 
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      penduduk: null, 
      isLoading: false,
      error: null,
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    formatTanggal(tanggal) {
      if (!tanggal) return null; 
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(tanggal).toLocaleDateString('id-ID', options);
    },
    async fetchResidents() {
      const pendudukId = this.residentToView?.idpenduduk;

      if (!pendudukId) {
        this.error = 'ID penduduk tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      
      try {
        const apiResponse = await getDetailResident(pendudukId);
        const responseData = apiResponse.data;

        if (Array.isArray(responseData) && responseData.length > 0) {
          const pendudukData = responseData[0]?.data?.[0];
          if (pendudukData) {
            this.penduduk = pendudukData;
          } else {
            this.error = 'Struktur data penduduk di dalam respons tidak valid';
          }
        } 
      } catch (err) {
        console.error("Gagal mengambil detail penduduk:", err);
        this.error = err.response?.data?.message || err.message || 'Terjadi kesalahan saat memuat data';
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchResidents();
  },
  watch: {
    residentToView: {
      handler(newValue, oldValue) {
        if (newValue?.idpenduduk !== oldValue?.idpenduduk) {
          this.fetchResidents();
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050;
}

.modal-content {
  background: white; border-radius: 8px; width: 90%;
  max-width: 1000px; max-height: 90vh;
  box-shadow: 0 5px 15px rgba(0,0,0,.5);
  display: flex; flex-direction: column;
}

.modal-header, .modal-footer {
  padding: 1rem; flex-shrink: 0;
}

.modal-body {
  padding: 1.5rem 2rem; overflow-y: auto; flex-grow: 1;
}

.modal-header {
  border-bottom: 1px solid #dee2e6; display: flex;
  justify-content: space-between; align-items: center;
}

.modal-footer {
  border-top: 1px solid #dee2e6; display: flex;
  justify-content: flex-end;
}

.penduduk { 
  font-weight: 600; color: #333;
}

.nik { 
  color: #6c757d; font-size: 0.95rem;
}

.detail-section {
  margin-top: 1.75rem;
}

.detail-section h4 {
  font-size: 1.2rem; font-weight: 600;
  color: #000000;
  border-bottom: 2px solid #6c757d;
  padding-bottom: 0.5rem; margin-bottom: 1rem;
}

.detail-item {
  margin-bottom: 1rem;
}

.detail-item label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.detail-item span {
  font-size: 1rem;
  font-weight: 500;
  color: #212529;
}
</style>
