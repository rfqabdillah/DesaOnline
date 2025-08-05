<template>
  <div class="col-sm-12">
    <add-edit-religion-modal
      v-if="isModalVisible"
      :religion-to-edit="religionBeingEdited"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Agama</h3>
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
              <label for="filterName" class="form-label">Nama Agama</label>
              <input type="text" id="filterName" class="form-control" v-model="filters.namaagama" placeholder="Filter berdasarkan nama agama">
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
              <th scope="col" @click="sortBy('namaagama')">
                Nama Agama
                <i class="fa fa-sort-asc" v-if="sortColumn === 'namaagama' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'namaagama' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedReligions" :key="item.idagama">
              <th scope="row">{{ (currentPage - 1) * perPage + index + 1 }}</th>
              <td>{{ item.namaagama }}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-primary btn-sm" @click="openEditModal(item)">
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button class="btn btn-danger sweet-11 btn-sm" type="button" @click="advancedDeleteAlert(item.idagama)">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedReligions.length === 0">
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
import { getReligions, deleteReligion } from '@/services/referensi/religions';
import AddEditReligionModal from './addEditReligionModal.vue';
import { useToast } from "vue-toastification";

export default {
  components: { AddEditReligionModal },
  data() {
    return {
      religions: [],
      sortColumn: '',
      sortDirection: 'asc',
      isModalVisible: false,
      currentPage: 1,
      perPage: 20,
      totalItems: 0,
      religionBeingEdited: null,
      jumpPage: 1,
      isFilterVisible: false,
      filters: {
        religion_name: '',
      },
    };
  },
  computed: {
    paginatedReligions() {
      return this.religions;
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
      this.fetchReligions();
      this.jumpPage = this.currentPage;
    },
    perPage() {
      this.currentPage = 1;
      this.fetchReligions();
    },
  },
  async mounted() {
    this.toast = useToast();
    await this.fetchReligions();
  },
  methods: {
    openAddModal() {
      this.religionBeingEdited = null;
      this.isModalVisible = true;
    },
    openEditModal(item) {
      this.religionBeingEdited = { ...item };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.religionBeingEdited = null;
    },
    handleSaveSuccessful() {
      this.closeModal();
      this.fetchReligions();
    },
    async fetchReligions() {
      try {
        const params = {
          act: 'agama',
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

        const response = await getReligions(params);
        
        const religionData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.[0]?.meta?.pagination || {};

        this.religions = religionData;
        this.totalItems = meta.total || religionData.length;
        
      } catch (error) {
        console.error("Error fetching agama:", error);
        this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Gagal memuat data agama. Silakan coba lagi nanti.',
        });
      }
    },
    advancedDeleteAlert(id) {
      this.$swal({
        title: 'Hapus Data Agama',
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
            await deleteReligion(id);
            if (this.religions.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            } else {
              this.fetchReligions();
            }
            this.toast.success("Data agama berhasil dihapus", { icon: 'fa fa-check' });
          } catch (error) {
            this.toast.error("Gagal menghapus data agama", { icon: 'fa fa-times' });
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
      this.fetchReligions();
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
      this.fetchReligions();
    },
    resetFilters() {
      this.filters.namaagama = '';
      
      this.sortColumn = '';
      this.sortDirection = 'asc';
      this.currentPage = 1;
      this.fetchReligions();
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