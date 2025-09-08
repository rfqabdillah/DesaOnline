<template>
  <div>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">Detail Surat Masuk</h5>
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

          <div v-else-if="incomingLetterDetail" class="profile-container">
            <div class="text-center mb-4">
              <h2 class="letter-subject mt-3">{{ incomingLetterDetail.perihal || 'Perihal Tidak Tersedia' }}</h2>
              <p class="letter-meta">
                Nomor: <strong>{{ incomingLetterDetail.nomor_surat || '-' }}</strong>
              </p>
              <p class="letter-meta">
                Dari: <strong>{{ incomingLetterDetail.pengirim || '-' }}</strong>
              </p>
            </div>
            
            <hr>

            <div class="detail-section">
              <h4><i class="fa fa-info-circle me-2"></i>Informasi Umum</h4>
              <div class="row">
                <div class="col-md-6 detail-item">
                  <label>Jenis Surat</label>
                  <span>{{ incomingLetterDetail.jenissuratmasuk?.nama_jenis_surat_masuk || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Desa</label>
                  <span>{{ incomingLetterDetail.wilayah?.nama_wilayah || '-' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fa fa-calendar me-2"></i>Waktu</h4>
              <div class="row">
                <div class="col-md-6 detail-item">
                  <label>Tanggal Surat</label>
                  <span>{{ formattedTanggalSurat }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Tanggal Diterima</label>
                  <span>{{ formattedTanggalDiterima }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fa fa-file-text-o me-2"></i>Isi</h4>
              <div class="row">
                <div class="col-12 detail-item">
                  <label>Ringkasan</label>
                  <p class="address-text">{{ incomingLetterDetail.ringkasan || '-' }}</p>
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
import { getDetailIncomingLetter } from '@/services/general/documents/incomingLetters';

export default {
  name: 'DetailIncomingLetterModal',
  props: {
    incomingLetterToView: { 
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      incomingLetterDetail: null, 
      isLoading: false,
      error: null,
    };
  },
  computed: {
    formattedTanggalSurat() {
      if (!this.incomingLetterDetail?.tanggal_surat) return '-';
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(this.incomingLetterDetail.tanggal_surat).toLocaleDateString('id-ID', options);
    },
    formattedTanggalDiterima() {
      if (!this.incomingLetterDetail?.tanggal_diterima) return '-';
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(this.incomingLetterDetail.tanggal_diterima).toLocaleDateString('id-ID', options);
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },

    async fetchIncomingLetterDetail() {
      const incomingLetterId = this.incomingLetterToView?.id_surat_masuk;

      if (!incomingLetterId) {
        this.error = 'ID surat masuk tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      
      try {
        const apiResponse = await getDetailIncomingLetter(incomingLetterId);
        const responseData = apiResponse.data;

        if (Array.isArray(responseData) && responseData.length > 0) {
          const incomingLetterData = responseData[0]?.data?.[0];
          if (incomingLetterData) {
            this.incomingLetterDetail = incomingLetterData;
          } else {
            this.error = 'Struktur data surat masuk di dalam respons tidak valid';
          }
        } else {
            this.error = 'Data surat masuk tidak ditemukan dalam respons API.';
        }
      } catch (err) {
        console.error("Gagal mengambil detail surat masuk:", err);
        this.error = err.response?.data?.message || err.message || 'Terjadi kesalahan saat memuat data';
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchIncomingLetterDetail();
  },
  watch: {
    incomingLetterToView: {
      handler(newValue, oldValue) {
        if (newValue?.id_surat_masuk !== oldValue?.id_surat_masuk) {
          this.fetchIncomingLetterDetail();
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

.letter-subject { 
  font-weight: 600; color: #333;
}

.letter-meta { 
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

.address-text {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>