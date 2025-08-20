<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Detail Pengguna</h5>
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

        <div v-else-if="userDetail" class="user-details-container">
          <div class="profile-header text-center">
            <img v-if="userDetail.photo" :src="userDetail.photo" alt="Foto Pengguna" class="profile-photo" onerror="this.src='https://placehold.co/150/EBF4FF/7F9CF5?text=Foto'"/>
            <img v-else src="https://placehold.co/150/EBF4FF/7F9CF5?text=Foto" alt="Foto Default" class="profile-photo" />
            <h3 class="user-name mt-3">{{ userDetail.name || 'Nama Tidak Tersedia' }}</h3>
            <p class="user-role">{{ userDetail.roles?.role_name || 'Role tidak diketahui' }}</p>
          </div>

          <hr class="my-4">

          <div class="profile-details">
            <div class="detail-item mb-3">
              <h5><i class="fa fa-envelope me-2"></i>Email</h5>
              <p>{{ userDetail.email || '-' }}</p>
            </div>
            <div class="detail-item mb-3">
              <h5><i class="fa fa-phone me-2"></i>Telepon</h5>
              <p>{{ userDetail.telp || '-' }}</p>
            </div>
             <div class="detail-item mb-3">
              <h5><i class="fa fa-venus-mars me-2"></i>Jenis Kelamin</h5>
              <p>{{ formattedGender }}</p>
            </div>
            <div class="detail-item mb-3">
              <h5><i class="fa fa-birthday-cake me-2"></i>Tempat & Tanggal Lahir</h5>
              <p>{{ userDetail.pob || '-' }}, {{ formattedDob }}</p>
            </div>
            <div class="detail-item mb-3">
              <h5><i class="fa fa-map-marker me-2"></i>Alamat</h5>
              <p class="address-text">{{ userDetail.address || '-' }}</p>
            </div>
            <div class="detail-item">
              <h5><i class="fa fa-calendar-check-o me-2"></i>Bergabung Sejak</h5>
              <p>{{ formattedCreatedAt }}</p>
            </div>
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
import { getDetailUsers } from '@/services/referensi/users';

export default {
  name: 'DetailUserModal',
  props: {
    userToView: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      userDetail: null,
      isLoading: false,
      error: null,
      debugMessage: '',
    };
  },
  computed: {
    formattedGender() {
      if (!this.userDetail || !this.userDetail.gender) return '-';
      // Menyesuaikan dengan data yang diterima (Laki-laki/Perempuan)
      if (this.userDetail.gender.toUpperCase() === 'L' || this.userDetail.gender.toUpperCase() === 'LAKI-LAKI') return 'Laki-laki';
      if (this.userDetail.gender.toUpperCase() === 'P' || this.userDetail.gender.toUpperCase() === 'PEREMPUAN') return 'Perempuan';
      return this.userDetail.gender;
    },
    formattedDob() {
      if (!this.userDetail || !this.userDetail.dob) return '-';
      try {
        return new Date(this.userDetail.dob).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } catch (e) {
        return this.userDetail.dob;
      }
    },
    formattedCreatedAt() {
      if (!this.userDetail || !this.userDetail.created_at) return '-';
      try {
        return new Date(this.userDetail.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } catch (e) {
        return this.userDetail.created_at;
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchUserDetail() {
      const userId = this.userToView?.user_id;

      if (!userId) {
        this.error = 'ID user tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.debugMessage = '';

      try {
        const response = await getDetailUsers(userId);
        const responseData = response.data; // Simpan response.data ke variabel

        // ## PERBAIKAN UTAMA DI SINI ##
        // Logika disesuaikan dengan struktur data baru: [ { data: [...] } ]
        if (
          Array.isArray(responseData) &&
          responseData.length > 0 &&
          responseData[0] &&
          Array.isArray(responseData[0].data) &&
          responseData[0].data.length > 0
        ) {
          this.userDetail = responseData[0].data[0];
        } else {
          this.error = 'Data pengguna tidak ditemukan atau format respons tidak sesuai.';
          this.debugMessage = `Struktur data yang diterima: ${JSON.stringify(responseData)}`;
        }
      } catch (err) {
        console.error("Gagal mengambil detail pengguna:", err);
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
    this.fetchUserDetail();
  },
  watch: {
    userToView: {
      handler(newValue, oldValue) {
        if (newValue?.user_id !== oldValue?.user_id) {
          this.fetchUserDetail();
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
  max-width: 800px; /* Lebar disesuaikan untuk detail pengguna */
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
  padding: 2rem;
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

.user-name {
  font-weight: 600;
  color: #333;
}

.user-role {
  color: #6c757d;
  font-size: 0.9rem;
}

.detail-item h5 {
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.25rem;
}

.detail-item p {
  font-size: 1rem;
  color: #212529;
  margin-bottom: 0;
}

.address-text {
  white-space: pre-wrap; /* Agar baris baru pada alamat tetap ditampilkan */
  line-height: 1.6;
}

/* ADDED: Style baru untuk foto profil */
.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%; /* Membuat gambar menjadi lingkaran */
  object-fit: cover;
  border: 3px solid #dee2e6;
  background-color: #f8f9fa;
}

/* Hapus style yang tidak perlu */
.featured-image, .text-content, .detail-section {
    display: none;
}
</style>