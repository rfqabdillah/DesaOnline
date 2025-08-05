<template>
  <div class="col-sm-12">
    
    <add-edit-resident-modal
      v-if="isModalVisible"
      :resident-to-edit="residentBeingEdited"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <detail-resident-modal
      v-if="isDetailModalVisible"
      :resident-to-view="residentBeingViewed"
      @close="closeDetailModal"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Penduduk</h3>
      </div>
      <div class="card-body">
        <div class="d-flex justify-content-end align-items-start mb-3">
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light txt-dark" @click="toggleFilterVisibility">
              <i v-if="isFilterVisible" class="fa fa-angle-up me-2"></i>
              <i v-else class="fa fa-angle-down me-2"></i>
              <span> {{ isFilterVisible ? 'Sembunyikan' : 'Tampilkan' }} Filter</span>
            </button>
            <button class="btn btn-success" @click="openAddModal">
              <i class="fa fa-plus me-2"></i>
              <span> Tambah Data</span>
            </button>
          </div>
        </div>

        <div v-if="isFilterVisible" class="border p-3 mb-3 rounded filter-section">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="filterNik" class="form-label">NIK</label>
              <input type="text" id="filterNik" class="form-control" v-model="filters.nik" placeholder="Filter berdasarkan NIK...">
            </div>
            <div class="col-md-4">
              <label for="filterName" class="form-label">Nama Penduduk</label>
              <input type="text" id="filterName" class="form-control" v-model="filters.nama" placeholder="Filter berdasarkan nama penduduk...">
            </div>
            <div class="col-md-4">
              <label for="filterGender" class="form-label">Jenis Kelamin</label>
              <select id="filterGender" class="form-select" v-model="filters.idjeniskelamin">
                <option value="">Semua Jenis Kelamin</option>
                <option v-for="gender in genderList" :key="gender.idjeniskelamin" :value="gender.idjeniskelamin">
                  {{ gender.namajeniskelamin }}
                </option>
              </select>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-3">
            <button class="btn btn-secondary" @click="resetFilters">
              <i class="fa fa-refresh me-2"></i>
              <span>Reset Filter</span>
            </button>
            <button class="btn btn-primary" @click="applyFilters">
              <i class="fa fa-search me-2"></i>
              <span>Terapkan Filter</span>
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive signal-table">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col" @click="sortBy('nik')">
                NIK
                <i class="fa fa-sort-asc" v-if="sortColumn === 'nik' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'nik' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" @click="sortBy('nama')">
                Nama 
                <i class="fa fa-sort-asc" v-if="sortColumn === 'nama' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'nama' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" @click="sortBy('namajeniskelamin')">
                Jenis Kelamin
                <i class="fa fa-sort-asc" v-if="sortColumn === 'namajeniskelamin' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'namajeniskelamin' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col">Tempat, Tanggal Lahir</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Memuat data...</p>
              </td>
            </tr>
            <template v-else>
              <tr v-for="(item, index) in paginatedResidents" :key="item.idpenduduk">
                <th scope="row">{{(currentPage - 1) * perPage + index + 1 }}</th>
                <td>{{ item.nik || '-'}}</td>
                <td>{{ item.nama || '-'}}</td>
                <td>{{ item.jk.namajeniskelamin || '-'}}</td>
                <td>{{ [item.tempatlahir, formatTanggal(item.tanggallahir)].filter(Boolean).join(', ') || '-' }}</td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-info btn-sm" @click="openDetailModal(item)" title="Lihat Detail Data">
                      <i class="fa fa-eye"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" @click="openEditModal(item)" title="Ubah Data">
                      <i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger sweet-11 btn-sm" type="button" @click="advancedDeleteAlert(item.idpenduduk)" title="Hapus Data">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedResidents.length === 0">
                <td colspan="6" class="text-center">Tidak ada data yang cocok atau tersedia.</td>
              </tr>
            </template>
          </tbody>
        </table>
        <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-center mt-3 px-3 pb-3">
          <div class="mt-2">
            <span v-if="totalItems > 0" class="text-muted">
              Menampilkan <strong>{{ (currentPage - 1) * perPage + 1 }}</strong> - <strong>{{ Math.min(currentPage * perPage, totalItems) }}</strong> dari <strong>{{ totalItems }}</strong> data
            </span>
          </div>
          <nav v-if="perPage !== -1 && totalPages > 1" class="d-flex align-items-center flex-wrap gap-2 mt-2">
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }"><button class="page-link" @click="changePage(currentPage - 1)">Prev</button></li>
              <li class="page-item" v-if="pageNumbers[0] > 1"><button class="page-link" @click="changePage(1)">1</button></li>
              <li class="page-item disabled" v-if="pageNumbers[0] > 2"><span class="page-link">...</span></li>
              <li v-for="page in pageNumbers" :key="page" class="page-item" :class="{ active: currentPage === page }"><button class="page-link" @click="changePage(page)">{{ page }}</button></li>
              <li class="page-item disabled" v-if="pageNumbers.slice(-1)[0] < totalPages - 1"><span class="page-link">...</span></li>
              <li class="page-item" v-if="pageNumbers.slice(-1)[0] < totalPages"><button class="page-link" @click="changePage(totalPages)">{{ totalPages }}</button></li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }"><button class="page-link" @click="changePage(currentPage + 1)">Next</button></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getResidents, deleteResident } from '@/services/general/population/residents'; 
import AddEditResidentModal from './addEditResidentModal.vue';
import DetailResidentModal from './detailResident.vue';
import { useToast } from "vue-toastification";
import { getGenders } from '@/services/referensi/genders';

export default {
  components: { AddEditResidentModal, DetailResidentModal }, 
  data() {
    return {
      residents: [],
      genderList: [],
      isLoading: false, 
      sortColumn: 'created_at',
      sortDirection: 'asc',
      isModalVisible: false,
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      residentBeingEdited: null,
      isFilterVisible: false,
      filters: {
        namapenduduk: '',
        namakategoripenduduk: '',
        namawilayah: '',
      },
      isDetailModalVisible: false,
      residentBeingViewed: null,
    };
  },
  computed: {
    paginatedResidents() {
      return this.residents;
    },
    totalPages() {
      if (this.perPage <= 0) return 1;
      return Math.ceil(this.totalItems / this.perPage);
    },
    pageNumbers() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;
      if (end > this.totalPages) {
        end = this.totalPages;
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  watch: {
    currentPage() {
      this.fetchResidents();
    },
    perPage() {
      this.currentPage = 1;
      this.fetchResidents();
    },
  },
  async mounted() {
    this.toast = useToast();
    await this.fetchResidents();
    await this.fetchGenders();
  },
  methods: {
    openAddModal() {
      this.residentBeingEdited = null;
      this.isModalVisible = true;
    },
    openEditModal(item) {
      this.residentBeingEdited = { ...item };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.residentBeingEdited = null;
    },
    openDetailModal(item) {
      this.residentBeingViewed = { ...item };
      this.isDetailModalVisible = true;
    },
    closeDetailModal() {
      this.isDetailModalVisible = false;
      this.residentBeingViewed = null;
    },
    handleSaveSuccessful() {
      this.closeModal();
      this.fetchResidents();
    },
    formatTanggal(tanggal) {
      if (!tanggal) return null; 
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(tanggal).toLocaleDateString('id-ID', options);
    },
    async fetchResidents() {
      this.isLoading = true; 
      try {
        const params = {
          act: 'penduduk', 
          page: this.currentPage,
          limit: this.perPage,
          order: this.sortColumn ? `${this.sortColumn} ${this.sortDirection}` : '',
          group: '',
        };
        const filterParts = Object.entries(this.filters)
          .filter(([, value]) => value !== '' && value !== null)
          .map(([key, value]) => `${key}=${value}`);
        
        if (filterParts.length > 0) {
          params.filter = filterParts.join(',');
        } else {
          params.filter = '';
        }
        
        const response = await getResidents(params);
        const residentData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.meta?.pagination || response.data?.[0]?.meta?.pagination || {};

        this.residents = residentData;
        this.totalItems = meta.total || residentData.length;
        
      } catch (error) {
        console.error("Error fetching residents:", error);
        this.toast.error("Gagal memuat data penduduk", { icon: 'fa fa-times' });
      } finally {
        this.isLoading = false; 
      }
    },
    async fetchGenders() {
    try {
      const response = await getGenders({ limit: -1 });
      this.genderList = response.data?.data || response.data?.[0]?.data || [];
    } catch (error) {
      this.toast.error("Gagal memuat daftar jenis kelamin");
    }
  },
    advancedDeleteAlert(id) { 
      this.$swal({
        title: 'Hapus Data Penduduk',
        text: 'Apakah Anda yakin ingin menghapus data ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check me-2"></i></i> Hapus!',
        confirmButtonColor: '#d33',
        cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
        cancelButtonColor: '#efefef',
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteResident(id); 
            if (this.residents.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            } else {
              this.fetchResidents();
            }
            this.toast.success("Data penduduk berhasil dihapus", { icon: 'fa fa-check' });
          } catch (error) {
            this.toast.error("Gagal menghapus data penduduk", { icon: 'fa fa-times' });
          }
        }
      });
    },
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
      this.fetchResidents();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    toggleFilterVisibility() {
      this.isFilterVisible = !this.isFilterVisible;
    },
    applyFilters() {
      this.currentPage = 1;
      this.fetchResidents();
    },
    resetFilters() {
      this.filters.namawilayah = '';
      this.filters.tahunawal = '';
      this.filters.tahunakhir = '';
      this.filters.tanggal_sk = '';
      this.filters.idjeniskelamin = '';
      this.sortColumn = 'created_at'; 
      this.sortDirection = 'asc';
      this.currentPage = 1;
      this.fetchResidents();
    },
  },
};
</script>

<style scoped>
th {
  cursor: pointer;
  white-space: nowrap; 
}
th i.fa {
  margin-left: 5px;
  font-size: 0.8em;
  vertical-align: middle;
}
.filter-section {
  background-color: #f8f9fa;
}
.table td, .table th {
  padding-right: 1.7rem; 
}
</style>