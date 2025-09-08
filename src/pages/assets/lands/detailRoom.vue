<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Detail Data Ruangan</h5>
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

        <div v-else-if="room" class="room-container">
          <div class="text-center mb-4">
            <h2 class="nama-aset mt-3">{{ room.namaruangan || 'Nama Ruangan Belum Diatur' }}</h2>
            <p class="alamat-aset">
              <i class="fa fa-building me-1"></i> 
              Berada di Gedung: <strong>{{ room.gedung?.namagedung || '-' }}</strong>
            </p>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-info-circle me-2"></i>Informasi Ruangan</h4>
            <div class="row">
              <div class="col-md-12">
                <div class="text-content">
                  <ul class="list-unstyled">
                    <li><strong>Kondisi:</strong> {{ room.kondisi?.namakondisi || '-' }}</li>
                    <li><strong>Keterangan:</strong> {{ room.keterangan || '-' }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-id-card-o me-2"></i>Informasi Gedung Induk</h4>
            <div class="row">
              <div class="col-md-12">
                <div class="text-content">
                  <ul class="list-unstyled">
                    <li><strong>Nama Gedung:</strong> {{ room.gedung?.namagedung || '-' }}</li>
                    <li><strong>Kode Aset Gedung:</strong> {{ room.gedung?.kodeaset || '-' }}</li>
                    <li><strong>Nomor Register Gedung:</strong> {{ room.gedung?.nomorregister || '-' }}</li>
                  </ul>
                </div>
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
</template>

<script>
import { getDetailRoom } from '@/services/general/assets/rooms'; 

export default {
  name: 'DetailRoomModal',
  props: {
    roomToView: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      room: null,
      isLoading: false,
      error: null,
      debugMessage: '', 
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchRoomDetail() {
      const roomId = this.roomToView?.idruangan;

      if (!roomId) {
        this.error = 'ID ruangan tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.debugMessage = '';
      
      try {
        const response = await getDetailRoom(roomId);
        const responseData = response.data; 
        if (responseData && responseData.length > 0 && responseData[0].data && responseData[0].data.length > 0) {
          this.room = responseData[0].data[0]; 
        } else {
          this.error = 'Data detail ruangan tidak ditemukan atau format respons tidak sesuai.';
          this.debugMessage = `Struktur data yang diterima: ${JSON.stringify(response.data)}`;
        }
      } catch (err) {
          console.error("Gagal mengambil detail ruangan:", err);
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
    this.fetchRoomDetail();
  },
  watch: {
    roomToView: {
      handler(newValue, oldValue) {
        if (newValue?.idruangan !== oldValue?.idruangan) {
          this.fetchRoomDetail();
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
  background: white; border-radius: 8px; width: 90%; max-width: 800px; 
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