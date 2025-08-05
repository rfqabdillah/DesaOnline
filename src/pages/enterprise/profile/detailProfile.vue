<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Detail Profil Usaha</h5>
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
            <img v-if="profile.logousaha" :src="profile.logousaha" alt="Logo Usaha" class="logo-usaha" onerror="this.src='https://placehold.co/150x150/EBF4FF/7F9CF5?text=Logo'"/>
            <img v-else src="https://placehold.co/150x150/EBF4FF/7F9CF5?text=Logo" alt="Logo Default" class="logo-usaha" />
            <h2 class="nama-usaha mt-3">{{ profile.namausaha || 'Nama Usaha Belum Diatur' }}</h2>
            <p class="alamat-usaha">
              {{ profile.alamatusaha || 'Alamat belum diatur' }}
            </p>
          </div>
          
          <hr>

          <div class="row detail-section">
            <div class="col-md-6">
              <h5><i class="fa fa-map-marker me-2"></i>Asal Desa</h5>
              <p>{{ profile.wilayah?.namawilayah || '-' }}</p>
            </div>
            <div class="col-md-6">
              <h5><i class="fa fa-briefcase me-2"></i>Bidang Usaha</h5>
              <p>{{ profile.bidang?.namabidangusaha || '-' }}</p>
            </div>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4>Deskripsi Usaha</h4>
            <p class="text-content">{{ profile.deskripsiusaha || 'Tidak ada deskripsi usaha.' }}</p>
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
import { getDetailProfileEnterprise } from '@/services/general/enterprise/profileEnterprise';

export default {
  name: 'DetailUsahaModal', // Nama komponen diubah
  props: {
    profileToView: {
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
    async fetchUsahaProfile() { // Nama method diubah
      const profileId = this.profileToView?.idusaha;

      if (!profileId) {
        this.error = 'ID badan usaha tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.debugMessage = '';
      
      try {
      const response = await getDetailProfileEnterprise(profileId);
      const responseData = response.data; 

      if (responseData && responseData.length > 0 && responseData[0].data && responseData[0].data.length > 0) {
          this.profile = responseData[0].data[0]; 
      } else {
          this.error = 'Data profil usaha tidak ditemukan atau format respons tidak sesuai.';
          this.debugMessage = `Struktur data yang diterima: ${JSON.stringify(responseData)}`;
      }
      } catch (err) {
          console.error("Gagal mengambil detail profil usaha:", err);
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
    this.fetchUsahaProfile();
  },
  watch: {
    profileToView: {
      handler(newValue, oldValue) {
        if (newValue?.idusaha !== oldValue?.idusaha) {
          this.fetchUsahaProfile();
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

.logo-usaha {
  display: block;
  margin: 0 auto;
  max-height: 120px;
  object-fit: cover;
  /* border-radius: 50%;  */
}

.nama-usaha {
  font-weight: 600;
  color: #333;
}

.alamat-usaha {
  color: #6c757d;
  font-size: 0.95rem;
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

.detail-section h5 {
  font-size: 1rem;
  font-weight: 500;
  color: #555;
}

.detail-item span {
  font-size: 1rem;
  font-weight: 500;
  color: #212529;
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