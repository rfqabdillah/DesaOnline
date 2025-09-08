<template>
  <div class="col-sm-12">
    <add-edit-regulation-modal
      v-if="isModalVisible"
      :regulation-to-edit="regulationBeingEdited"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <detail-regulation-modal
      v-if="isDetailModalVisible"
      :regulation-to-view="regulationBeingViewed"
      @close="closeDetailModal"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Regulasi</h3>
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
            <div class="col-md-3">
              <label class="form-label">Judul Regulasi</label>
              <input type="text" class="form-control" v-model="filters.judul" placeholder="Filter judul...">
            </div>
            <div class="col-md-3">
              <label class="form-label">Tahun</label>
              <input type="number" class="form-control" v-model="filters.tahun" placeholder="Filter tahun...">
            </div>
            <div class="col-md-3">
              <label class="form-label">Jenis Regulasi</label>
                <select class="form-select" v-model="filters.idjenisregulasi">
                  <option value="">Semua Jenis</option>
                  <option v-for="jenis in jenisRegulasiList" :key="jenis.idjenisregulasi" :value="jenis.idjenisregulasi">
                    {{ jenis.namajenisregulasi }}
                  </option>
                </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Nama Desa</label>
                <select class="form-select" v-model="filters.id_desa">
                  <option value="">Semua Desa</option>
                  <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                    {{ desa.wilayah.namawilayah }}
                  </option>
                </select>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button class="btn btn-secondary" @click="resetFilters">
              <i class="fa fa-refresh me-2"></i><span>Reset</span>
            </button>
            <button class="btn btn-primary" @click="applyFilters">
                <i class="fa fa-search me-2"></i><span>Cari</span>
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive signal-table">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col" @click="sortBy('judul')">
                Judul <i class="fa" :class="getSortIcon('judul')"></i>
              </th>
              <th scope="col" @click="sortBy('nama_jenis_regulasi')">
                Jenis Regulasi <i class="fa" :class="getSortIcon('nama_jenis_regulasi')"></i>
              </th>
               <th scope="col" @click="sortBy('tahun')">
                Tahun <i class="fa" :class="getSortIcon('tahun')"></i>
              </th>
              <th scope="col" @click="sortBy('nama_wilayah')">
                Desa <i class="fa" :class="getSortIcon('nama_wilayah')"></i>
              </th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in regulations" :key="item.idregulasi">
              <th scope="row">{{ (currentPage - 1) * perPage + index + 1 }}</th>
              <td>{{ item.judul || '-' }}</td>
              <td>{{ item.jenis_regulasi?.nama_jenis_regulasi || '-' }}</td>
              <td>{{ item.tahun || '-' }}</td>
              <td>{{ item.wilayah?.namawilayah || '-' }}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-success btn-sm" @click="openSuratFile(item.dokumen)" title="Lihat File Surat">
                      <i class="fa fa-file"></i>
                  </button>
                  <button class="btn btn-info btn-sm" @click="openDetailModal(item)" title="Lihat Detail">
                    <i class="fa fa-eye"></i>
                  </button>
                  <button class="btn btn-primary btn-sm" @click="openEditModal(item)" title="Ubah Data">
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button class="btn btn-danger btn-sm" @click="advancedDeleteAlert(item)" title="Hapus Data">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="regulations.length === 0">
              <td colspan="6" class="text-center">Tidak ada data yang cocok atau tersedia.</td>
            </tr>
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
                <li class="page-item" v-for="page in pageNumbers" :key="page" :class="{ active: currentPage === page }"><button class="page-link" @click="changePage(page)">{{ page }}</button></li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }"><button class="page-link" @click="changePage(currentPage + 1)">Next</button></li>
              </ul>
            </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteRegulation, getRegulations } from '@/services/general/documents/regulations';
import { getProfiles } from '@/services/general/villageInformation/profile';
import { getRegulationTypes } from '@/services/referensi/regulationTypes'; 
import AddEditRegulationModal from './addEditRegulationsModal.vue';
import DetailRegulationModal from './detailRegulations.vue';
import { useToast } from "vue-toastification";

export default {
  components: { AddEditRegulationModal, DetailRegulationModal },
  data() {
    return {
      regulations: [],
      desaList: [],
      jenisRegulasiList: [],
      sortColumn: 'created_at',
      sortDirection: 'asc',
      isModalVisible: false,
      currentPage: 1,
      perPage: 20,
      totalItems: 0,
      regulationBeingEdited: null,
      regulationBeingViewed: null,
      isDetailModalVisible: false,
      isFilterVisible: false,
      filters: {
        judul: '',
        tahun: '',
        idjenisregulasi: '',
        id_desa: '',
      },
      toast: null,
    };
  },
  computed: {
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
    currentPage() { this.fetchRegulations(); },
    perPage() { this.currentPage = 1; this.fetchRegulations(); },
  },
  async mounted() {
    this.toast = useToast();
    await this.fetchDesaList();
    await this.fetchJenisRegulasiList();
    await this.fetchRegulations();
  },
  methods: {
    async fetchDesaList() {
      try {
        const response = await getProfiles({ limit: -1 });
        this.desaList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar desa");
      }
    },
    async fetchJenisRegulasiList() {
        try {
            const response = await getRegulationTypes({ limit: -1 });
            this.jenisRegulasiList = response.data?.data || response.data?.[0]?.data || [];
        } catch (error) {
            this.toast.error("Gagal memuat daftar jenis regulasi");
        }
    },
    openAddModal() {
      this.regulationBeingEdited = null;
      this.isModalVisible = true;
    },
    openEditModal(item) {
      this.regulationBeingEdited = { ...item };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.regulationBeingEdited = null;
    },
    openDetailModal(item) {
      this.regulationBeingViewed = { ...item };
      this.isDetailModalVisible = true;
    },
    closeDetailModal() {
      this.isDetailModalVisible = false;
      this.regulationBeingViewed = null;
    },
    openSuratFile(fileUrl) {
      if (fileUrl) {
        window.open(fileUrl, '_blank');
      } else {
        this.toast.info("Tidak ada file surat yang tersedia", { icon: 'fa fa-info-circle' });
      }
    },
    handleSaveSuccessful() {
      this.closeModal();
      this.fetchRegulations();
    },
    async fetchRegulations() {
      try {
        const params = {
          page: this.currentPage,
          limit: this.perPage,
          order: this.sortColumn ? `${this.sortColumn} ${this.sortDirection}` : '',
        };
        const filterParts = Object.entries(this.filters)
          .filter(([, value]) => value !== '')
          .map(([key, value]) => `${key}=${value}`);
        if (filterParts.length > 0) {
          params.filter = filterParts.join(',');
        }
        
        const response = await getRegulations(params);
        const regulationData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.[0]?.meta?.pagination || {};
        this.regulations = regulationData;
        this.totalItems = meta.total || regulationData.length;
      } catch (error) {
        this.toast.error('Gagal memuat data regulasi.');
      }
    },
    advancedDeleteAlert(item) {
      this.$swal({
        title: `Hapus Regulasi "${item.judul}"?`,
        text: 'Apakah Anda yakin ingin menghapus data ini?',
        icon: 'warning', 
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: '#d33',
        cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
        cancelButtonColor: '#efefef',
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteRegulation(item.idregulasi);
            this.toast.success("Data regulasi berhasil dihapus");
            this.fetchRegulations();
          } catch (error) {
            this.toast.error("Gagal menghapus data regulasi");
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
      this.fetchRegulations();
    },
    getSortIcon(column) {
      if (this.sortColumn !== column) return 'fa-sort';
      if (this.sortDirection === 'asc') return 'fa-sort-asc';
      return 'fa-sort-desc';
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
      this.fetchRegulations();
    },
    resetFilters() {
      this.filters = {
        judul: '',
        tahun: '',
        idjenisregulasi: '',
        id_desa: '',
      };
      this.sortColumn = 'created_at';
      this.sortDirection = 'asc';
      this.fetchRegulations();
    },
    formatTanggal(tanggal) {
      if (!tanggal) return '-';
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(tanggal).toLocaleDateString('id-ID', options);
    },
  },
};
</script>

<style scoped>
th {
  cursor: pointer;
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
  white-space: nowrap; 
  padding-right: 1.7rem; 
}
</style>