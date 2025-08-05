<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Detail Profil Desa</h5>
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
            <img v-if="profile.logo" :src="profile.logo" alt="Logo Desa" class="logo-desa" onerror="this.src='https://placehold.co/150x150/EBF4FF/7F9CF5?text=Logo'"/>
            <img v-else src="https://placehold.co/150x150/EBF4FF/7F9CF5?text=Logo" alt="Logo Default" class="logo-desa" />
            <h2 class="nama-desa mt-3">{{ profile.namawilayah || 'Nama Desa Belum Diatur' }}</h2>
            <p class="alamat-desa">
              {{ profile.alamatkantor || 'Alamat belum diatur' }}
              <span v-if="profile.kodepos">, Kode Pos {{ profile.kodepos }}</span>
            </p>
          </div>
          
          <hr>

          <div class="row detail-section">
            <div class="col-md-4">
              <h5><i class="fa fa-envelope me-2"></i>Email</h5>
              <p>{{ profile.email || '-' }}</p>
            </div>
            <div class="col-md-4">
              <h5><i class="fa fa-globe me-2"></i>Website</h5>
              <p>{{ profile.website || '-' }}</p>
            </div>
            <div class="col-md-4">
              <h5><i class="fa fa-map-marker me-2"></i>Koordinat</h5>
              <p>{{ profile.koordinat || '-' }}</p>
            </div>
          </div>
          
          <hr>

          <div class="detail-section">
            <h4><i class="fa fa-user me-2"></i>Sambutan Kepala Desa</h4>
            <p class="text-content">{{ profile.sambutankepaladesa || 'Tidak ada data.' }}</p>
          </div>

          <div class="detail-section">
            <h4><i class="fa fa-bullseye me-2"></i>Visi & Misi</h4>
            <p class="text-content">{{ profile.visimisi || 'Tidak ada data.' }}</p>
          </div>

          <div class="detail-section">
            <h4><i class="fa fa-book me-2"></i>Sejarah Desa</h4>
            <p class="text-content">{{ profile.sejarah || 'Tidak ada data.' }}</p>
          </div>

          <div class="detail-section">
            <h4><i class="fa fa-info-circle me-2"></i>Profil Umum Desa</h4>
            <p class="text-content">{{ profile.profildesa || 'Tidak ada data.' }}</p>
          </div>

          <div class="detail-section">
            <h4><i class="fa fa-users me-2"></i>Profil Masyarakat</h4>
            <p class="text-content">{{ profile.profilmasyarakat || 'Tidak ada data.' }}</p>
          </div>

          <div class="detail-section">
            <h4><i class="fa fa-lightbulb-o me-2"></i>Profil Potensi Desa</h4>
            <p class="text-content">{{ profile.profilpotensi || 'Tidak ada data.' }}</p>
          </div>

          <div class="detail-section">
            <h4><i class="fa fa-image me-2"></i>Foto Kantor Desa</h4>
            <img v-if="profile.foto" :src="profile.foto" alt="Foto Kantor Desa" class="kantor-foto" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'" />
            <p v-else style="display: none;">Tidak ada foto.</p>
            <p v-if="!profile.foto">Tidak ada foto.</p>
          </div>

          <div class="detail-section">
  <h4><i class="fa fa-sitemap me-2"></i>Struktur Wilayah</h4>
  
  <div v-if="isStrukturLoading" class="text-center p-3">
    <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
    <p class="mt-2 mb-0">Memuat struktur wilayah...</p>
  </div>
  
  <div v-else-if="flatWilayahList.length > 0" class="table-responsive">
    <table class="table table-bordered table-striped struktur-wilayah-table">
      <thead class="table-light">
        <tr>
          <th style="width: 35%;">Nama Dusun</th>
          <th style="width: 25%;">Nama RW</th>
          <th style="width: 25%;">Nama RT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in flatWilayahList" :key="row.id">
          <td v-if="index === 0 || row.namaDusun !== flatWilayahList[index - 1].namaDusun">
            <strong>{{ row.namaDusun }}</strong>
            <div class="text-muted small">Kepala: {{ row.kepalaDusun }}</div>
          </td>
          <td v-else></td>

          <td v-if="index === 0 || row.namaRw !== flatWilayahList[index - 1].namaRw || row.namaDusun !== flatWilayahList[index - 1].namaDusun">
            {{ row.namaRw }}
            <div v-if="row.namaRw !== '-'" class="text-muted small">Ketua: {{ row.ketuaRw }}</div>
          </td>
          <td v-else></td>
          
          <td>
            {{ row.namaRt }}
            <div v-if="row.namaRt !== '-'" class="text-muted small">Ketua: {{ row.ketuaRt }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <p v-else class="text-muted">Data struktur wilayah tidak tersedia.</p>
</div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Tutup</button>
      </div>
    </div>
        </div>
      </div>

  </div>
</template>

<script>
import { getDetailProfile } from '@/services/general/villageInformation/profile';
import { getDusuns } from '@/services/general/villageInformation/dusun';
import { getRw } from '@/services/general/villageInformation/rw';
import { getRt } from '@/services/general/villageInformation/rt';

export default {
  name: 'DetailProfileModal',
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
      strukturWilayah: [],
      isStrukturLoading: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchProfile() {
      const profileId = this.profileToView?.iddesa;

      if (!profileId) {
        this.error = 'ID profile desa tidak valid atau tidak tersedia.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.debugMessage = '';
      
      try {
        const apiResponse = await getDetailProfile(profileId);
        const responseData = apiResponse.data;

        if (responseData && responseData.length > 0 && responseData[0].data && responseData[0].data.length > 0) {
          const rawProfile = responseData[0].data[0];
          this.profile = { ...rawProfile, ...rawProfile.wilayah };
          this.fetchStrukturWilayah(profileId); 
        } else {
          this.error = 'Data profil tidak ditemukan atau format respons tidak sesuai.';
          this.debugMessage = `Struktur data yang diterima: ${JSON.stringify(responseData)}`;
        }
      } catch (err) {
        console.error("Gagal mengambil detail profil:", err);
        this.error = err.message || 'Terjadi kesalahan saat memuat data.';
        if (err.response) {
            this.debugMessage = `Status: ${err.response.status} - Data: ${JSON.stringify(err.response.data)}`;
        }
      } finally {
        this.isLoading = false;
      }
    },
    async fetchStrukturWilayah(profileId) {
      this.isStrukturLoading = true;
      try {
        const dusunResponse = await getDusuns({ filter: `iddesa=${profileId}`, limit: -1 });
        const dusuns = dusunResponse.data?.data || dusunResponse.data?.[0]?.data || [];

        // Gunakan Promise.all untuk mengambil semua data RW & RT secara paralel
        this.strukturWilayah = await Promise.all(dusuns.map(async (dusun) => {
          const rwResponse = await getRw({ filter: `iddusun=${dusun.iddusun}`, limit: -1 });
          const rws = rwResponse.data?.data || rwResponse.data?.[0]?.data || [];

          const rwsWithRts = await Promise.all(rws.map(async (rw) => {
            const rtResponse = await getRt({ filter: `idrw=${rw.idrw}`, limit: -1 });
            const rts = rtResponse.data?.data || rtResponse.data?.[0]?.data || [];
            return { ...rw, rts }; // Kembalikan RW yang sudah berisi data RT
          }));

          return { ...dusun, rws: rwsWithRts }; // Kembalikan Dusun yang sudah berisi data RW
        }));

      } catch (err) {
        console.error("Gagal memuat struktur wilayah:", err);
        // Tidak menampilkan error di modal utama, cukup log di console
      } finally {
        this.isStrukturLoading = false;
      }
    },
  },
  mounted() {
    this.fetchProfile();
  },
  computed: {
    flatWilayahList() {
      const rows = [];
      if (!this.strukturWilayah) return [];

      this.strukturWilayah.forEach(dusun => {
        if (dusun.rws && dusun.rws.length > 0) {
          dusun.rws.forEach(rw => {
            if (rw.rts && rw.rts.length > 0) {
              rw.rts.forEach(rt => {
                rows.push({
                  id: rt.idrt, 
                  namaDusun: dusun.namadusun,
                  kepalaDusun: dusun.kadus?.namakepaladusun || '-',
                  namaRw: rw.namarw,
                  ketuaRw: rw.ketuarw?.namaketuarw || '-',
                  namaRt: rt.namart,
                  ketuaRt: rt.ketuart?.namaketuart || '-',
                });
              });
            } else {
              rows.push({
                id: `rw-${rw.idrw}`,
                namaDusun: dusun.namadusun,
                kepalaDusun: dusun.kadus?.namakepaladusun || '-',
                namaRw: rw.namarw,
                ketuaRw: rw.ketuarw?.namaketuarw || '-',
                namaRt: '-',
                ketuaRt: '-',
              });
            }
          });
        } else {
          rows.push({
            id: `dusun-${dusun.iddusun}`,
            namaDusun: dusun.namadusun,
            kepalaDusun: dusun.penduduk?.nama || '-',
            namaRw: '-',
            ketuaRw: '-',
            namaRt: '-',
            ketuaRt: '-',
          });
        }
      });
      return rows;
    }
  },
  watch: {
    profileToView: {
      handler(newValue, oldValue) {
        if (newValue?.iddesa !== oldValue?.iddesa) {
          this.fetchProfile();
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
  max-width: 1100px;
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

/* isi content */
.logo-desa {
  display: block;
  margin: 0 auto;
  max-height: 120px;
  /* width: 120px;
  border-radius: 50%; */
  object-fit: cover;
  /* border: 3px solid #f0f0f0; */
}

.nama-desa {
  font-weight: 600;
  color: #333;
}

.alamat-desa {
  color: #6c757d;
  font-size: 0.95rem;
}

.detail-section {
  margin-top: 1.5rem;
}

.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
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
}

.kantor-foto {
  width: 100%;
  max-width: 300px;
  display: block;
  margin-top: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.struktur-wilayah-table {
  margin-top: 1rem;
  font-size: 0.95rem;
}
.struktur-wilayah-table td {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  vertical-align: middle;
}
.struktur-wilayah-table thead th {
  font-weight: 600;
}

.struktur-wilayah-table {
  margin-top: 1rem;
  font-size: 16px; 
}
.struktur-wilayah-table th {
  vertical-align: middle;
}
.struktur-wilayah-table td {
  padding: 0.75rem;
  vertical-align: top; 
}
.struktur-wilayah-table .small {
    font-size: 0.85em; 
}
</style>
