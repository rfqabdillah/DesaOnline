<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Detail Program</h5>
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

        <div v-else-if="programDetail" class="program-details-container">
          <h2 class="program-title text-center mb-4">{{ programDetail.judul || 'Judul Belum Tersedia' }}</h2>

          <div class="row">
            <div class="col-md-5">
              <div class="detail-item">
                <h5><i class="fa fa-image me-2"></i>Poster</h5>
                <img v-if="programDetail.poster" :src="programDetail.poster" alt="Poster Program" class="featured-image" onerror="this.src='https://placehold.co/400x200/EBF4FF/7F9CF5?text=Poster'"/>
                <img v-else src="https://placehold.co/400x200/EBF4FF/7F9CF5?text=Poster" alt="Poster Default" class="featured-image" />
              </div>
            </div>

            <div class="col-md-7">
              <div class="detail-item mb-3">
                <h5><i class="fa fa-map-marker me-2"></i>Nama Desa</h5>
                <p>{{ programDetail.wilayah?.namawilayah || 'Lokasi tidak diketahui' }}</p>
              </div>

              <div class="detail-item mb-3">
                <h5><i class="fa fa-tags me-2"></i>Kategori Program</h5>
                <p>{{ programDetail.kategorikegiatan?.namakategorikegiatan || '-' }}</p>
              </div>

              <div class="detail-item mb-3">
                <h5><i class="fa fa-calendar me-2"></i>Tanggal Pelaksanaan</h5>
                <p>{{ formattedExecutionDate }}</p>
              </div>

              <div class="detail-item">
                <h5><i class="fa fa-clock-o me-2"></i>Waktu Pelaksanaan</h5>
                <p>{{ programDetail.jampelaksanaan || '-' }}</p>
              </div>
            </div>
          </div>

          <hr class="my-4">

          <div class="detail-section">
            <h4><i class="fa fa-file-text-o me-2"></i>Isi Konten</h4>
            <p class="text-content">{{ programDetail.konten || 'Tidak ada konten untuk ditampilkan.' }}</p>
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
import { getDetailProgram } from '@/services/general/activities/programs';

export default {
  name: 'DetailProgramModal',
  props: {
    programToView: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      programDetail: null,
      isLoading: false,
      error: null,
      debugMessage: '',
    };
  },
  computed: {
    formattedExecutionDate() {
      if (!this.programDetail) return '-';
      const { tanggalmulai, tanggalselesai } = this.programDetail;

      if (!tanggalmulai) return '-';

      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const startDate = new Date(tanggalmulai).toLocaleDateString('id-ID', options);

      if (tanggalmulai === tanggalselesai || !tanggalselesai) {
        return startDate;
      }

      const endDate = new Date(tanggalselesai).toLocaleDateString('id-ID', options);
      return `${startDate} - ${endDate}`;
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchProgramDetail() {
      const programId = this.programToView?.idkegiatan;

      if (!programId) {
        this.error = 'ID program tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.debugMessage = '';

      try {
        const response = await getDetailProgram(programId);
        const responseData = response.data;

        if (
          Array.isArray(responseData) &&
          responseData.length > 0 &&
          responseData[0] &&
          Array.isArray(responseData[0].data) &&
          responseData[0].data.length > 0
        ) {
          this.programDetail = responseData[0].data[0];
        } else {
          this.error = 'Data program tidak ditemukan atau format respons tidak sesuai.';
          this.debugMessage = `Struktur data yang diterima: ${JSON.stringify(responseData)}`;
        }
      } catch (err) {
        console.error("Gagal mengambil detail program:", err);
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
    this.fetchProgramDetail();
  },
  watch: {
    programToView: {
      handler(newValue, oldValue) {
        if (newValue?.idkegiatan !== oldValue?.idkegiatan) {
          this.fetchProgramDetail();
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

.program-title {
  font-weight: 600;
  color: #333;
}

.detail-item h5 {
  font-size: 0.95rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.25rem;
}

.detail-item p {
  font-size: 1rem;
  color: #212529;
  margin-bottom: 0;
}

.featured-image {
  display: block;
  width: 100%;
  max-height: 300px; 
  object-fit: cover; 
  border-radius: 6px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}

.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
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