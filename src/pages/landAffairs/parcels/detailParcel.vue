<template>
  <div>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">Detail Data Persil</h5>
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

          <div v-else-if="parcelDetail" class="profile-container">
            <div class="text-center mb-4">
              <h2 class="parcel-owner mt-3">{{ parcelDetail.nama_pemilik || 'Nama Pemilik Tidak Tersedia' }}</h2>
              <p class="parcel-id">
                NIK: {{ parcelDetail.nik_pemilik || '-' }}
              </p>
            </div>
            
            <hr>

            <div class="detail-section">
              <h4><i class="fa fa-file-text-o me-2"></i>Data Administratif</h4>
              <div class="row">
                <div class="col-md-6 detail-item">
                  <label>Desa</label>
                  <span>{{ parcelDetail.wilayah?.nama_wilayah || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Nomor Letter C</label>
                  <span>{{ parcelDetail.nomor_letter_c || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Nomor Persil</label>
                  <span>{{ parcelDetail.nomor_persil || '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Nomor Kohir</label>
                  <span>{{ parcelDetail.nomor_kohir || '-' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fa fa-map-o me-2"></i>Data Fisik & Lokasi</h4>
              <div class="row">
                <div class="col-md-6 detail-item">
                  <label>Luas</label>
                  <span>{{ parcelDetail.luas ? `${parcelDetail.luas} m²` : '-' }}</span>
                </div>
                <div class="col-md-6 detail-item">
                  <label>Koordinat</label>
                  <span>{{ parcelDetail.koordinat || '-' }}</span>
                </div>
                <div class="col-12 detail-item">
                  <label>Alamat / Lokasi</label>
                  <span class="address-text">{{ parcelDetail.alamat || '-' }}</span>
                </div>
                <div class="col-12 detail-item">
                  <label>Batas Tanah</label>
                  <span class="address-text">{{ parcelDetail.batas_tanah || '-' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fa fa-history me-2"></i>Riwayat</h4>
              <div class="row">
                <div class="col-12 detail-item">
                  <label>Riwayat Tanah</label>
                  <span class="address-text">{{ parcelDetail.riwayat_tanah || '-' }}</span>
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
import { getDetailParcel } from '@/services/general/landAffairs/parcels';

export default {
  name: 'DetailParcelModal',
  props: {
    parcelToView: { 
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      parcelDetail: null, 
      isLoading: false,
      error: null,
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchParcelDetail() {
      const parcelId = this.parcelToView?.id_persil;

      if (!parcelId) {
        this.error = 'ID persil tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      
      try {
        const apiResponse = await getDetailParcel(parcelId);
        const responseData = apiResponse.data;

        if (Array.isArray(responseData) && responseData.length > 0) {
          const parcelData = responseData[0]?.data?.[0];
          if (parcelData) {
            this.parcelDetail = parcelData;
          } else {
            this.error = 'Struktur data persil di dalam respons tidak valid';
          }
        } else {
            this.error = 'Data persil tidak ditemukan dalam respons API.';
        }
      } catch (err) {
        console.error("Gagal mengambil detail persil:", err);
        this.error = err.response?.data?.message || err.message || 'Terjadi kesalahan saat memuat data';
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchParcelDetail();
  },
  watch: {
    parcelToView: {
      handler(newValue, oldValue) {
        if (newValue?.id_persil !== oldValue?.id_persil) {
          this.fetchParcelDetail();
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

.parcel-owner { 
  font-weight: 600; color: #333;
}

.parcel-id { 
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

.address-text {
  white-space: pre-wrap; 
  line-height: 1.6;
}
</style>