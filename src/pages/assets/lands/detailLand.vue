<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Detail Data Tanah</h5>
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
          <small class="text-muted" v-if="debugMessage">Detail: {{ debugMessage }}</small>
        </div>

        <div v-else-if="land" class="land-container">
          <div class="text-center mb-4">
            <img v-if="land.foto" :src="land.foto" alt="Foto Tanah" class="foto" onerror="this.src='https://placehold.co/250x150/EBF4FF/7F9CF5?text=Foto+Aset'"/>
            <img v-else src="https://placehold.co/250x150/EBF4FF/7F9CF5?text=Foto+Aset" alt="Foto Default" class="foto" />
            <h2 class="nama-aset mt-3">{{ land.namaaset || 'Nama Aset Belum Diatur' }}</h2>
            <p class="alamat-aset"><i class="fa fa-map-marker me-1"></i> {{ land.alamat || 'Alamat belum diatur' }}</p>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-id-card-o me-2"></i>Identitas Aset</h4>
            <div class="row">
              <div class="col-md-6 mb-3">
                <div class="text-content">
                  <ul class="list-unstyled">
                    <li><strong>Kode Aset:</strong> {{ land.kodeaset || '-' }}</li>
                    <li><strong>Nomor Register:</strong> {{ land.nomorregister || '-' }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="text-content">
                  <ul class="list-unstyled">
                    <li><strong>Nama Desa:</strong> {{ land.wilayah?.namawilayah || '-' }}</li>
                    <li><strong>Penggunaan:</strong> {{ land.penggunaan || '-' }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-balance-scale me-2"></i>Legalitas & Status</h4>
            <div class="row">
              <div class="col-md-6 mb-3">
                  <div class="text-content">
                      <ul class="list-unstyled">
                          <li><strong>Status Hak:</strong> {{ land.hak?.namastatushak || '-' }}</li>
                          <li><strong>Asal Usul Tanah:</strong> {{ land.asalusul?.namaasalusultanah || '-' }}</li>
                          <li><strong>Prosedur Penguasaan:</strong> {{ land.prosedur?.namaprosedurpenguasaan || '-' }}</li>
                      </ul>
                  </div>
              </div>
              <div class="col-md-6 mb-3">
                  <div class="text-content">
                      <ul class="list-unstyled">
                          <li><strong>Nomor Sertifikat:</strong> {{ land.nomorsertifikat || '-' }}</li>
                          <li><strong>Tanggal Sertifikat:</strong> {{ land.tanggalsertifikat || '-' }}</li>
                          <li><strong>Luas Tanah:</strong> {{ land.luas ? land.luas + ' m²' : '-' }}</li>
                      </ul>
                  </div>
              </div>
            </div>
          </div>

          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-history me-2"></i>Riwayat Perolehan</h4>
            <div class="row">
              <div class="col-md-6 mb-3">
                <div class="text-content">
                  <ul class="list-unstyled">
                    <li><strong>Tahun Pengadaan:</strong> {{ land.tahunpengadaan || '-' }}</li>
                    <li><strong>Harga Perolehan:</strong> {{ formattedHargaPerolehan }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="text-content">
                  <ul class="list-unstyled">
                    <li><strong>Sumber Perolehan:</strong> {{ land.perolehan?.namaperolehan || '-' }}</li>
                    <li><strong>Sumber Anggaran:</strong> {{ land.anggaran?.namasumberanggaran || '-' }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div v-if="land.keterangan" class="detail-section">
            <hr>
            <h4><i class="fa fa-info-circle me-2"></i>Keterangan Tambahan</h4>
            <p class="text-content">{{ land.keterangan }}</p>
          </div>

        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetailLand } from '@/services/general/assets/lands';

export default {
  name: 'DetailTanahModal',
  props: {
    landToView: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      land: null,
      isLoading: false,
      error: null,
      debugMessage: '', 
    };
  },
  computed: {
    formattedHargaPerolehan() {
      if (!this.land || !this.land.hargaperolehan) {
        return '-';
      }
      const harga = parseInt(this.land.hargaperolehan, 10);
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(harga);
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchTanahDetail() {
      const landId = this.landToView?.idtanah;

      if (!landId) {
        this.error = 'ID tanah tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.debugMessage = '';
      
      try {
        const response = await getDetailLand(landId);
        const responseData = response.data; 
        if (responseData && responseData.length > 0 && responseData[0].data && responseData[0].data.length > 0) {
          this.land = responseData[0].data[0]; 
        } else {
          this.error = 'Data detail tanah tidak ditemukan atau format respons tidak sesuai.';
          this.debugMessage = `Struktur data yang diterima: ${JSON.stringify(response.data)}`;
        }
      } catch (err) {
          console.error("Gagal mengambil detail tanah:", err);
          this.error = err.message || 'Terjadi kesalahan saat memuat data.';
          if (err.response) {
            this.debugMessage = `Status: ${err.response.status} - Data: ${JSON.stringify(err.response.data)}`;
          }
      } finally {
          this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchTanahDetail();
  },
  watch: {
    landToView: {
      handler(newValue, oldValue) {
        if (newValue?.idtanah !== oldValue?.idtanah) {
          this.fetchTanahDetail();
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
  display: flex; justify-content: center; align-items: center; z-index: 1050;
}
.modal-content {
  background: white; border-radius: 8px; width: 90%; max-width: 1100px; 
  max-height: 90vh; box-shadow: 0 5px 15px rgba(0,0,0,.5);
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
  border-top: 1px solid #dee2e6; display: flex; justify-content: flex-end;
}
.foto {
  display: block; margin: 0 auto; max-height: 150px;
  max-width: 250px; object-fit: contain; border-radius: 6px;
}
.nama-aset {
  font-weight: 600; color: #333;
}
.alamat-aset {
  color: #6c757d; font-size: 1.1rem;
}
.detail-section {
  margin-top: 1rem; margin-bottom: 1rem;
}
.detail-section h4 {
  font-size: 1.2rem; font-weight: 600; color: #000000;
  border-bottom: 2px solid #6c757d; padding-bottom: 0.5rem; 
  margin-bottom: 1rem;
}
.text-content {
  white-space: pre-wrap; background-color: #f8f9fa;
  padding: 1rem; border-radius: 6px; color: #212529;
  line-height: 1.6; height: 100%; 
}
.list-unstyled {
  padding-left: 0; list-style: none; margin-bottom: 0;
}
.list-unstyled li {
  margin-bottom: 0.5rem;
}
.list-unstyled li:last-child {
  margin-bottom: 0;
}
</style>