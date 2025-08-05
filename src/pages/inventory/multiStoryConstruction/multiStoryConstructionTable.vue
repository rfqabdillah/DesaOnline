<template>
  <div class="col-sm-12">
    <add-edit-multiStoryConstruction-modal
      v-if="isModalVisible"
      :multiStoryConstruction-to-edit="multiStoryConstructionBeingEdited"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Nama Kontruksi Bertingkat</h3>
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
          <div class="row g-2">
            <div class="col-md-4">
              <label for="filterName" class="form-label">Nama Kontruksi Bertingkat</label>
              <input type="text" id="filterName" class="form-control" v-model="filters.namakonstruksibertingkat" placeholder="Filter berdasarkan nama kontruksi bertingkat">
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
              <th scope="col" @click="sortBy('namakonstruksibertingkat')">
                Nama Kontruksi Bertingkat
                <i class="fa fa-sort-asc" v-if="sortColumn === 'namakonstruksibertingkat' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'namakonstruksibertingkat' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedMultiStoryConstructions" :key="item.idkonstruksibertingkat">
              <th scope="row">{{ (currentPage - 1) * perPage + index + 1 }}</th>
              <td>{{ item.namakonstruksibertingkat }}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-primary btn-sm" @click="openEditModal(item)">
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button class="btn btn-danger sweet-11 btn-sm" type="button" @click="advancedDeleteAlert(item.idkonstruksibertingkat)">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedMultiStoryConstructions.length === 0">
              <td colspan="5" class="text-center">Tidak ada data yang cocok atau tersedia.</td>
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
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)">Prev</button>
              </li>
              <li class="page-item" v-if="pageNumbers[0] > 1">
                <button class="page-link" @click="changePage(1)">1</button>
              </li>
              <li class="page-item disabled" v-if="pageNumbers[0] > 2">
                <span class="page-link">...</span>
              </li>
              <li
                v-for="page in pageNumbers"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <button class="page-link" @click="changePage(page)">{{ page }}</button>
              </li>
              <li class="page-item disabled" v-if="pageNumbers.slice(-1)[0] < totalPages - 1">
                <span class="page-link">...</span>
              </li>
              <li class="page-item" v-if="pageNumbers.slice(-1)[0] < totalPages">
                <button class="page-link" @click="changePage(totalPages)">{{ totalPages }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMultiStoryConstructions, deleteMultiStoryConstruction } from '@/services/referensi/multiStoryConstruction';
import AddEditMultiStoryConstructionModal from './addEditMultiStoryConstructionModal.vue';
import { useToast } from "vue-toastification";

export default {
  components: { AddEditMultiStoryConstructionModal },
  data() {
    return {
      multiStoryConstructions: [],
      sortColumn: '',
      sortDirection: 'asc',
      isModalVisible: false,
      currentPage: 1,
      perPage: 20,
      totalItems: 0,
      multiStoryConstructionBeingEdited: null,
      jumpPage: 1,
      isFilterVisible: false,
      filters: {
        multiStoryConstruction_name: '',
      },
    };
  },
  computed: {
    paginatedMultiStoryConstructions() {
      return this.multiStoryConstructions;
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
      this.fetchMultiStoryConstructions();
      this.jumpPage = this.currentPage;
    },
    perPage() {
      this.currentPage = 1;
      this.fetchMultiStoryConstructions();
    },
  },
  async mounted() {
    this.toast = useToast();
    await this.fetchMultiStoryConstructions();
  },
  methods: {
    openAddModal() {
      this.multiStoryConstructionBeingEdited = null;
      this.isModalVisible = true;
    },
    openEditModal(item) {
      this.multiStoryConstructionBeingEdited = { ...item };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.multiStoryConstructionBeingEdited = null;
    },
    handleSaveSuccessful() {
      this.closeModal();
      this.fetchMultiStoryConstructions();
    },
    async fetchMultiStoryConstructions() {
      try {
        const params = {
          act: 'konstruksi-bertingkat',
          page: this.currentPage,
          limit: this.perPage,
          order: this.sortColumn ? `${this.sortColumn} ${this.sortDirection}` : '',
          group: '',
        };

        const filterParts = Object.entries(this.filters)
          .filter(([key, value]) => value !== '')
          .map(([key, value]) => `${key}=${value}`);

        if (filterParts.length > 0) {
          params.filter = filterParts.join(',');
        } else {
          params.filter = '';
        }

        const response = await getMultiStoryConstructions(params);
        
        const multiStoryConstructionData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.[0]?.meta?.pagination || {};

        this.multiStoryConstructions = multiStoryConstructionData;
        this.totalItems = meta.total || multiStoryConstructionData.length;
        
      } catch (error) {
        console.error("Error fetching konstruksi bertingkat:", error);
        this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Gagal memuat data konstruksi bertingkat. Silakan coba lagi nanti.',
        });
      }
    },
    advancedDeleteAlert(id) {
      this.$swal({
        title: 'Hapus Data Kontruksi Bertingkat',
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
            await deleteMultiStoryConstruction(id);
            if (this.multiStoryConstructions.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            } else {
              this.fetchMultiStoryConstructions();
            }
            this.toast.success("Data konstruksi bertingkat berhasil dihapus", { icon: 'fa fa-check' });
          } catch (error) {
            this.toast.error("Gagal menghapus data konstruksi bertingkat", { icon: 'fa fa-times' });
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
      this.fetchMultiStoryConstructions();
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
      this.fetchMultiStoryConstructions();
    },
    resetFilters() {
      this.filters.namakonstruksibertingkat = '';
      
      this.sortColumn = '';
      this.sortDirection = 'asc';
      this.currentPage = 1;
      this.fetchMultiStoryConstructions();
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
.controls-wrapper {
  max-width: 450px;
}
.pagination .page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.5;
}
.filter-section {
  background-color: #f8f9fa;
}
.table td, .table th {
  white-space: nowrap; 
  padding-right: 1.7rem; 
}
</style>