<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Detail Data Barang</h5>
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

        <div v-else-if="item" class="item-container">
          <div class="text-center mb-4">
            <img v-if="item.foto" :src="item.foto" alt="Foto Barang" class="foto" onerror="this.src='https://placehold.co/150x150/EBF4FF/7F9CF5?text=Foto'"/>
            <img v-else src="https://placehold.co/150x150/EBF4FF/7F9CF5?text=Foto" alt="Foto Default" class="foto" />
            <h2 class="nama-barang mt-3">{{ item.namabarang || 'Nama Barang' }} ({{ item.kodebarang || 'N/A' }})</h2>
            <p class="merk">{{ item.merk || 'Merk belum diatur' }}</p>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-id-card-o me-2"></i>Informasi & Status Utama</h4>
            <div class="row">
              <div class="col-md-6">
                <div class="text-content">
                    <ul class="list-unstyled">
                      <li><strong>Kode Barang:</strong> {{ item.kodebarang || '-' }}</li>
                      <li><strong>Nomor Register:</strong> {{ item.nomorregister || '-' }}</li>
                      <hr class="my-2">
                      <li><strong>Nomor Seri / Pabrik:</strong> {{ item.nomorseri || '-' }}</li>
                      <li><strong>Bahan:</strong> {{ item.bahan || '-' }}</li>
                    </ul>
                </div>
              </div>
              <div class="col-md-6">
                <h5><i class="fa fa-map-marker me-2"></i>Asal Desa</h5>
                <p>{{ item.wilayah?.namawilayah || '-' }}</p>
                
                <h5 class="mt-3"><i class="fa fa-wrench me-2"></i>Kondisi Barang</h5>
                <p>{{ item.kondisi?.namakondisi || '-' }}</p>

                <h5 class="mt-3"><i class="fa fa-check-square me-2"></i>Keberadaan Fisik</h5>
                <p>{{ item.fisik?.namakeberadaanfisik || '-' }}</p>
              </div>
            </div>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-cogs me-2"></i>Spesifikasi & Riwayat</h4>
            <div class="row">
                <div class="col-md-6">
                    <div class="text-content">
                        <ul class="list-unstyled">
                            <li><strong>Ukuran / Spesifikasi:</strong> {{ item.ukuran || '-' }}</li>
                            <li><strong>Tahun:</strong> {{ item.tahun || '-' }}</li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="text-content">
                        <ul class="list-unstyled">
                            <li><strong>Harga:</strong> {{ formattedHarga }}</li>
                            <li><strong>Sumber Anggaran:</strong> {{ item.anggaran?.namasumberanggaran || '-' }}</li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>

          <div v-if="item.keterangan" class="detail-section">
            <hr>
            <h4><i class="fa fa-info-circle me-2"></i>Keterangan Tambahan</h4>
            <p class="text-content">{{ item.keterangan }}</p>
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
import { getDetailItem } from '@/services/general/assets/items';

export default {
  name: 'DetailBarangModal',
  props: {
    itemToView: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      item: null,
      isLoading: false,
      error: null,
      debugMessage: '',
    };
  },
  computed: {
    formattedHarga() {
      if (!this.item || !this.item.harga) {
        return '-';
      }
      const harga = parseInt(this.item.harga, 10);
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
    async fetchBarangDetail() {
      const itemId = this.itemToView?.idbarang;

      if (!itemId) {
        this.error = 'ID barang tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.debugMessage = '';

      try {
        const response = await getDetailItem(itemId);
        const responseData = response.data;
        if (responseData && responseData.length > 0 && responseData[0].data && responseData[0].data.length > 0) {
          this.item = responseData[0].data[0];
        } else {
          this.error = 'Data detail barang tidak ditemukan atau format respons tidak sesuai.';
          this.debugMessage = `Struktur data yang diterima: ${JSON.stringify(response.data)}`;
        }
      } catch (err) {
        console.error("Gagal mengambil detail barang:", err);
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
    this.fetchBarangDetail();
  },
  watch: {
    itemToView: {
      handler(newValue, oldValue) {
        if (newValue?.idbarang !== oldValue?.idbarang) {
          this.fetchBarangDetail();
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1000px; 
  max-height: 90vh;
  box-shadow: 0 5px 15px rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
}

.modal-header, .modal-footer {
  padding: 1rem;
  flex-shrink: 0;
}

.modal-body {
  padding: 1.5rem 2rem;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
}

.foto {
  display: block;
  margin: 0 auto;
  max-height: 150px;
  max-width: 250px;
  object-fit: contain;
  border-radius: 6px;
}

.nama-barang {
  font-weight: 600;
  color: #333;
}

.merk {
  color: #6c757d;
  font-size: 1.1rem;
}

.detail-section {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.detail-section h4 {
  font-size: 1.2rem; font-weight: 600;
  color: #000000;
  border-bottom: 2px solid #6c757d;
  padding-bottom: 0.5rem; 
  margin-bottom: 1rem;
}

.detail-section h5 {
  font-size: 1rem;
  font-weight: 500;
  color: #555;
}

.text-content {
  white-space: pre-wrap; 
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  color: #212529;
  line-height: 1.6;
  height: 100%; 
}

.list-unstyled {
  padding-left: 0;
  list-style: none;
  margin-bottom: 0;
}
</style>