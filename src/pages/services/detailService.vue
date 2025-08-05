<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Detail Layanan</h5>
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

        <div v-else-if="profile" class="profile-container">
          <div class="text-center mb-4">
            <h2 class="profile-title mt-3">{{ profile.namalayanan || 'Judul Belum Tersedia' }}</h2>
            
            <p class="profile-subtitle">
              <i class="fa fa-map-marker me-2"></i>
              {{ profile.wilayah?.namawilayah || 'Lokasi tidak diketahui' }}
            </p>
          </div>
          
          <hr>

          <div class="detail-section">
            <h5><i class="fa fa-calendar me-2"></i>Diterbitkan pada</h5>
            <p>{{ profile.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' }}</p>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-file-text-o me-2"></i>Persyaratan</h4>
            <p class="text-content">{{ profile.persyaratan || 'Belum ada persyaratan yang ditentukan.' }}</p>
          </div>

          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-list-ol me-2"></i>Tahapan</h4>
            <p class="text-content">{{ profile.tahapan || 'Belum ada tahapan yang ditentukan.' }}</p>
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
import { getDetailService } from '@/services/general/services/services';

export default {
  name: 'DetailServiceModal', 
  props: {
    serviceToView: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      profile: null,
      isLoading: false,
      error: null,
      debugMessage: '', 
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchServiceDetail() { 
      const serviceId = this.serviceToView?.idlayanan;

      if (!serviceId) {
        this.error = 'ID layanan tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.debugMessage = '';
      
      try {
        const response = await getDetailService(serviceId);
        const responseData = response.data; 

        if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].data && Array.isArray(responseData[0].data) && responseData[0].data.length > 0) {
          // Mengambil objek profil dari array bagian dalam
          this.profile = responseData[0].data[0]; 
        } else {
          this.error = 'Data layanan tidak ditemukan atau format respons tidak sesuai.';
          this.debugMessage = `Struktur data yang diterima: ${JSON.stringify(responseData)}`;
        }
      } catch (err) {
        console.error("Gagal mengambil detail layanan:", err);
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
    this.fetchServiceDetail();
  },
  watch: {
    serviceToView: {
      handler(newValue, oldValue) {
        if (newValue?.idlayanan !== oldValue?.idlayanan) {
          this.fetchServiceDetail();
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
  max-width: 800px; 
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

.profile-title {
  font-weight: 600;
  color: #333;
}

.profile-subtitle {
  color: #6c757d;
  font-size: 0.95rem;
}

.detail-section {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
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
}
</style>