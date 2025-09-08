<template>
  <div>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">Detail Regulasi</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Memuat data...</p>
          </div>

          <div v-else-if="error" class="text-center p-5 text-danger">
            <i class="fa fa-exclamation-triangle fa-3x mb-3"></i>
            <h4>Terjadi Kesalahan</h4>
            <p>{{ error }}</p>
          </div>

          <div v-else-if="regulationDetail" class="profile-container">
            <div class="text-center mb-4">
              <h2 class="regulation-title mt-3">{{ regulationDetail.judul || 'Judul Tidak Tersedia' }}</h2>
              <p class="regulation-meta">
                Tahun: <strong>{{ regulationDetail.tahun || '-' }}</strong>
              </p>
            </div>
            
            <hr>

            <div class="detail-section">
              <h4><i class="fa fa-info-circle me-2"></i>Informasi Umum</h4>
              <div class="row">
                <div class="col-md-6 detail-item">
                  <label>Jenis Regulasi</label>
                  <span>{{ regulationDetail.jenis_regulasi?.nama_jenis_regulasi || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Desa</label>
                  <span>{{ regulationDetail.wilayah?.namawilayah || '-' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fa fa-file-text-o me-2"></i>Isi</h4>
              <div class="row">
                <div class="col-12 detail-item">
                  <label>Deskripsi</label>
                  <p class="description-text">{{ regulationDetail.deskripsi || '-' }}</p>
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
import { getDetailRegulation } from '@/services/general/documents/regulations';

export default {
  name: 'DetailRegulationModal',
  props: {
    regulationToView: { 
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      regulationDetail: null, 
      isLoading: false,
      error: null,
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchRegulationDetail() {
      const regulationId = this.regulationToView?.idregulasi;

      if (!regulationId) {
        this.error = 'ID regulasi tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      
      try {
        const apiResponse = await getDetailRegulation(regulationId);
        let regulationData = null;
        const responseData = apiResponse.data;

        if (Array.isArray(responseData) && responseData.length > 0) {
          regulationData = responseData[0]?.data?.[0];
        } else if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
          regulationData = responseData.data || responseData;
        }

        if (regulationData && typeof regulationData === 'object') {
          this.regulationDetail = regulationData;
        } else {
          this.error = 'Data regulasi tidak ditemukan atau format respons tidak dikenali.';
          console.warn("Struktur respons API tidak terduga:", responseData);
        }
      } catch (err) {
        console.error("Gagal mengambil detail regulasi:", err);
        this.error = err.response?.data?.message || err.message || 'Terjadi kesalahan saat memuat data';
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchRegulationDetail();
  },
  watch: {
    regulationToView: {
      handler(newValue, oldValue) {
        if (newValue?.idregulasi !== oldValue?.idregulasi) {
          this.fetchRegulationDetail();
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
  max-width: 800px; max-height: 90vh;
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
.regulation-title { 
  font-weight: 600; color: #333;
}
.regulation-meta { 
  color: #6c757d; font-size: 0.95rem; margin-bottom: 0.25rem;
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
.detail-item span, .detail-item p {
  font-size: 1rem;
  font-weight: 500;
  color: #212529;
}
.description-text {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>