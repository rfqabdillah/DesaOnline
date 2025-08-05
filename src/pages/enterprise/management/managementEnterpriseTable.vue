<template>
  <div class="col-sm-12">
    
    <add-edit-management-modal
      v-if="isModalVisible"
      :management-to-edit="managementBeingEdited"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Pengurus Usaha</h3>
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

        <!-- Filter -->
        <div v-if="isFilterVisible" class="border p-3 mb-3 rounded filter-section">
            <div class="row g-3">
              <div class="col-md-3">
              <label for="filterEnterpriseName" class="form-label">Nama Usaha</label>
              <input type="text" id="filterEnterpriseName" class="form-control" v-model="filters.namausaha" placeholder="Filter berdasarkan nama usaha">
              </div>
            <div class="col-md-3">
              <label for="filterSkDate" class="form-label">Tanggal SK</label>
              <input type="date" id="filterSkDate" class="form-control" v-model="filters.tanggal_sk">
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

      <!-- Tabel -->
      <div class="table-responsive signal-table">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col" style="width: 80px;">Logo Usaha</th>
              <th scope="col" @click="sortBy('namausaha')">
                Nama Usaha
                <i class="fa fa-sort-asc" v-if="sortColumn === 'namausaha' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'namausaha' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" @click="sortBy('tanggal_sk')">
                Tanggal SK
                <i class="fa fa-sort-asc" v-if="sortColumn === 'tanggal_sk' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'tanggal_sk' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Memuat data...</p>
              </td>
            </tr>    
            <template v-else>
              <tr v-for="(item, index) in managements" :key="item.idpengurus">
                <th scope="row"> {{ (currentPage - 1) * perPage + index + 1 }}</th>
                <td>
                  <img :src="item.usaha?.logousaha" alt="Logo Usaha" style="height: 40px; width: auto;" v-if="item.usaha?.logousaha">
                  <span v-else class="text-muted">-</span>
                </td>
                <td>{{ item.usaha?.namausaha || '-' }}</td>
                <td>{{ item.tanggal_sk || '-' }}</td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-info btn-sm" @click="openSkFile(item.filesk)" title="Lihat File SK">
                      <i class="fa fa-file"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" @click="openEditModal(item)" title="Ubah Data">
                      <i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger sweet-11 btn-sm" type="button" @click="advancedDeleteAlert(item.idpengurus)" title="Hapus Data">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedManagements.length === 0">
                <td colspan="5" class="text-center">Tidak ada data yang cocok atau tersedia.</td>
              </tr>
            </template>  
          </tbody>
        </table>

        <!-- Pagination -->
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
import { getManagements, deleteManagement } from '@/services/general/enterprise/management'; 
import AddEditManagementModal from './addEditManagementModal.vue';
import { useToast } from "vue-toastification";

export default {
  components: { AddEditManagementModal }, 
  data() {
    return {
      managements: [],
      isLoading: false, 
      sortColumn: 'created_at',
      sortDirection: 'asc',
      isModalVisible: false,
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      managementBeingEdited: null,
      isFilterVisible: false,
      filters: {
        namausaha: '',
        tanggal_sk: '',
      },
    };
  },
  computed: {
    paginatedManagements() {
      return this.managements;
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
      this.fetchManagements();
    },
    perPage() {
      this.currentPage = 1;
      this.fetchManagements();
    },
  },
  async mounted() {
    this.toast = useToast();
    await this.fetchManagements();
  },
  methods: {
    openAddModal() {
      this.managementBeingEdited = null;
      this.isModalVisible = true;
    },
    openEditModal(item) {
      this.managementBeingEdited = { ...item };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.managementBeingEdited = null;
    },
    openSkFile(fileUrl) {
      if (fileUrl) {
        window.open(fileUrl, '_blank');
      } else {
        this.toast.info("Tidak ada file SK yang tersedia.", { icon: 'fa fa-info-circle' });
      }
    },
    handleSaveSuccessful() {
      this.closeModal();
      this.fetchManagements();
    },
    async fetchManagements() {
      this.isLoading = true; 
      try {
        const params = {
          act: 'pengurus-usaha', 
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
        
        const response = await getManagements(params);
        const managementData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.meta?.pagination || response.data?.[0]?.meta?.pagination || {};

        this.managements = managementData;
        this.totalItems = meta.total || managementData.length;
        
      } catch (error) {
        console.error("Error fetching managements:", error);
        this.toast.error("Gagal memuat data pengurus usaha", { icon: 'fa fa-times' });
      } finally {
        this.isLoading = false; 
      }
    },
    advancedDeleteAlert(id) { 
      this.$swal({
        title: 'Hapus Data Pengurus Usaha',
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
            await deleteManagement(id); 
            if (this.managements.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            } else {
              this.fetchManagements();
            }
            this.toast.success("Data pengurus usaha berhasil dihapus", { icon: 'fa fa-check' });
          } catch (error) {
            this.toast.error("Gagal menghapus data pengurus usaha", { icon: 'fa fa-times' });
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
      this.fetchManagements();
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
      this.fetchManagements();
    },
    resetFilters() {
      this.filters.namadesa = '';
      this.filters.tahunawal = '';
      this.filters.tahunakhir = '';
      this.filters.tanggal_sk = '';
      this.sortColumn = 'created_at'; 
      this.sortDirection = 'desc';
      this.currentPage = 1;
      this.fetchManagements();
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