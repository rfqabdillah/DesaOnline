<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Detail Data Bangunan</h5>
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

        <div v-else-if="building" class="building-container">
          <div class="text-center mb-4">
            <img v-if="building.foto" :src="building.foto" alt="Foto Bangunan" class="foto" onerror="this.src='https://placehold.co/250x150/EBF4FF/7F9CF5?text=Foto+Aset'"/>
            <img v-else src="https://placehold.co/250x150/EBF4FF/7F9CF5?text=Foto+Aset" alt="Foto Default" class="foto" />
            <h2 class="nama-aset mt-3">{{ building.namagedung || 'Nama Bangunan Belum Diatur' }}</h2>
            <p class="alamat-aset"><i class="fa fa-map-marker me-1"></i> {{ building.alamat || 'Alamat belum diatur' }}</p>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-id-card-o me-2"></i>Identitas Aset</h4>
            <div class="row">
              <div class="col-md-6 mb-3">
                <div class="text-content">
                  <ul class="list-unstyled">
                    <li><strong>Kode Aset:</strong> {{ building.kodeasetgedung || '-' }}</li>
                    <li><strong>Nomor Register:</strong> {{ building.nomorregistergedung || '-' }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="text-content">
                  <ul class="list-unstyled">
                    <li><strong>Nama Desa:</strong> {{ building.wilayah?.namawilayah || '-' }}</li>
                    <li><strong>Di atas Tanah:</strong> {{ building.tanah?.namaaset || '-' }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-building-o me-2"></i>Spesifikasi & Kondisi</h4>
            <div class="row">
              <div class="col-md-6 mb-3">
                  <div class="text-content">
                      <ul class="list-unstyled">
                          <li><strong>Luas Bangunan:</strong> {{ building.luas ? building.luas + ' m²' : '-' }}</li>
                          <li><strong>Kondisi:</strong> {{ building.kondisi?.namakondisi || '-' }}</li>
                          <li><strong>Keberadaan Fisik:</strong> {{ building.fisik?.namakeberadaanfisik || '-' }}</li>
                      </ul>
                  </div>
              </div>
              <div class="col-md-6 mb-3">
                  <div class="text-content">
                      <ul class="list-unstyled">
                          <li><strong>Konstruksi Bertingkat:</strong> {{ building.tingkat?.namakonstruksibertingkat || '-' }}</li>
                          <li><strong>Konstruksi Beton:</strong> {{ building.beton?.namakonstruksibeton || '-' }}</li>
                      </ul>
                  </div>
              </div>
            </div>
          </div>

          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-history me-2"></i>Riwayat & Dokumen</h4>
            <div class="row">
              <div class="col-md-6 mb-3">
                <div class="text-content">
                  <ul class="list-unstyled">
                    <li><strong>Tahun Pengadaan:</strong> {{ building.tahunpengadaan || '-' }}</li>
                    <li><strong>Biaya Pengadaan:</strong> {{ formattedBiayaPengadaan }}</li>
                    <li><strong>Perolehan:</strong> {{ building.perolehan?.namaperolehan || '-' }}</li>
                    <li><strong>Sumber Anggaran:</strong> {{ building.anggaran?.namasumberanggaran || '-' }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="text-content">
                  <ul class="list-unstyled">
                    <li><strong>Nomor Dokumen:</strong> {{ building.nomordokumen || '-' }}</li>
                    <li><strong>Tanggal Dokumen:</strong> {{ building.tanggaldokumen || '-' }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <hr>
            <h4><i class="fa fa-map-o me-2"></i>Lokasi Peta</h4>

            <div v-if="building && building.geojson" class="map-container-detail">
              <l-map
                ref="detailMap"
                style="height: 100%; width: 100%"
                :zoom="mapZoom"
                :center="mapCenter"
                @ready="onMapReady"
              >
                <l-tile-layer :url="mapUrl" :attribution="mapAttribution"></l-tile-layer>
                <l-geo-json v-if="parsedGeoJson" :geojson="parsedGeoJson"></l-geo-json>
              </l-map>
            </div>

            <div v-else class="text-muted text-center p-4 border rounded" style="background: #f8f9fa;">
              <i class="fa fa-map-o fa-2x mb-2 d-block"></i>
              <p class="mb-0">Belum ada data peta untuk desa ini.</p>
            </div>
          </div>

          <div class="detail-section">
            <hr>
            <h4><i class="fa fa-info-circle me-2"></i>Keterangan Tambahan</h4>
            <p class="text-content">{{ building.keterangan || '-' }}</p>
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
import { getDetailBuilding } from '@/services/general/assets/buildings';

import { LMap, LTileLayer, LGeoJson } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';

export default {
  name: 'DetailBuildingModal',
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  props: {
    buildingToView: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      building: null,
      isLoading: false,
      error: null,
      debugMessage: '', 
      mapZoom: 15,
      mapCenter: [-7.5029, 109.9042], 
      mapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      mapAttribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    };
  },
  computed: {
    formattedBiayaPengadaan() {
      if (!this.building || !this.building.biayapengadaan) {
        return '-';
      }
      const harga = parseInt(this.building.biayapengadaan, 10);
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(harga);
    },
    parsedGeoJson() {
      if (!this.land || !this.land.geojson) {
        return null;
      }
      try {
        return JSON.parse(this.land.geojson);
      } catch (e) {
        console.error("GeoJSON tidak valid:", e);
        return null;
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    onMapReady(mapObject) {
      this.$nextTick(() => {
        mapObject.invalidateSize();
        
        if (this.parsedGeoJson) {
          const bounds = L.geoJSON(this.parsedGeoJson).getBounds();
          if (bounds.isValid()) {
            mapObject.fitBounds(bounds);
          }
        }
      });
    },
    async fetchBuildingDetail() {
      const buildingId = this.buildingToView?.idgedung;

      if (!buildingId) {
        this.error = 'ID bangunan tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.debugMessage = '';
      
      try {
        const response = await getDetailBuilding(buildingId);
        const responseData = response.data; 
        if (responseData && responseData.length > 0 && responseData[0].data && responseData[0].data.length > 0) {
          this.building = responseData[0].data[0]; 
        } else {
          this.error = 'Data detail bangunan tidak ditemukan atau format respons tidak sesuai.';
          this.debugMessage = `Struktur data yang diterima: ${JSON.stringify(response.data)}`;
        }
      } catch (err) {
          console.error("Gagal mengambil detail bangunan:", err);
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
    this.fetchBuildingDetail();
  },
  watch: {
    buildingToView: {
      handler(newValue, oldValue) {
        if (newValue?.idgedung !== oldValue?.idgedung) {
          this.fetchBuildingDetail();
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

.map-container-detail {
  width: 100%;
  height: 350px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 1rem;
}
</style>