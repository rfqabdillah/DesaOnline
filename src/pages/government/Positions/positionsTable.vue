<template>
  <div class="col-sm-12">
    <add-edit-position-modal
      v-if="isModalVisible"
      :position-to-edit="positionBeingEdited"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Nama Jabatan</h3>
      </div>

      <div class="card-body">
        <div class="d-flex justify-content-end align-items-start mb-3">
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light txt-dark" @click="toggleFilterVisibility">
              <i v-if="isFilterVisible" class="fa fa-angle-up me-2"></i>
              <i v-else class="fa fa-angle-down me-2"></i>
              <span> {{ isFilterVisible ? 'Sembunyikan' : 'Tampilkan' }} Filter</span>
            </button>
            <button class="btn btn-success" @click="openAddModal" v-if="isSuperAdmin">
              <i class="fa fa-plus me-2"></i>
              <span> Tambah Data</span>
            </button>
          </div>
        </div>
        <div v-if="isFilterVisible" class="border p-3 mb-3 rounded filter-section">
          </div>
      </div>

      <div class="table-responsive signal-table">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col" @click="sortBy('namajabatan')">
                Nama Jabatan
                <i class="fa fa-sort-asc" v-if="sortColumn === 'namajabatan' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'namajabatan' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" v-if="isSuperAdmin">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedPositions" :key="item.idjabatan">
              <th scope="row">{{ (currentPage - 1) * perPage + index + 1 }}</th>
              <td>{{ item.namajabatan }}</td>
              <td v-if="isSuperAdmin">
                <div class="btn-group">
                  <button class="btn btn-primary btn-sm" @click="openEditModal(item)">
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button class="btn btn-danger sweet-11 btn-sm" type="button" @click="advancedDeleteAlert(item)">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedPositions.length === 0">
              <td :colspan="isSuperAdmin ? 3 : 2" class="text-center">Tidak ada data yang cocok atau tersedia.</td>
            </tr>
          </tbody>
        </table>
        
        <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-center mt-3 px-3 pb-3">
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPositions, deletePosition } from '@/services/referensi/positions';
import AddEditPositionModal from './addEditPositionModal.vue';
import { useToast } from "vue-toastification";

export default {
  components: { AddEditPositionModal },
  data() {
    return {
      positions: [],
      sortColumn: 'namajabatan',
      sortDirection: 'asc',
      isModalVisible: false,
      currentPage: 1,
      perPage: 20,
      totalItems: 0,
      positionBeingEdited: null,
      jumpPage: 1,
      isFilterVisible: false,
      filters: {
        namajabatan: '',
      },
      userRole: null, 
    };
  },
  computed: {
    isSuperAdmin() {
      return this.userRole === 'Superadmin';
    },
    paginatedPositions() {
      return this.positions;
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
      this.fetchPositions();
      this.jumpPage = this.currentPage;
    },
    perPage() {
      this.currentPage = 1;
      this.fetchPositions();
    },
  },
  async mounted() {
    this.toast = useToast();
    this.loadUserRole(); 
    await this.fetchPositions();
  },
  methods: {
    loadUserRole() {
      const userDataString = localStorage.getItem('userData'); 
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          if (userData && userData.data && userData.data[0] && userData.data[0].role) {
            this.userRole = userData.data[0].role.nama_level;
          }
        } catch (error) {
          console.error("Gagal mem-parsing data pengguna dari localStorage:", error);
          this.userRole = null; 
        }
      }
    },
    openAddModal() {
      this.positionBeingEdited = null;
      this.isModalVisible = true;
    },
    openEditModal(item) {
      this.positionBeingEdited = { ...item };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.positionBeingEdited = null;
    },
    handleSaveSuccessful() {
      this.closeModal();
      this.fetchPositions();
    },
    async fetchPositions() {
      try {
        const params = {
          act: 'jabatan',
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

        const response = await getPositions(params);
        
        const positionData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.[0]?.meta?.pagination || {};

        this.positions = positionData;
        this.totalItems = meta.total || positionData.length;
        
      } catch (error) {
        console.error("Error fetching jabatan:", error);
        this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Gagal memuat data jabatan. Silakan coba lagi nanti.',
        });
      }
    },
    advancedDeleteAlert(item) {
      this.$swal({
        title: `Hapus Jabatan "${item.namajabatan}"`,
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
            await deletePosition(item.idjabatan);
            if (this.positions.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            } else {
              this.fetchPositions();
            }
            this.toast.success("Data jabatan berhasil dihapus", { icon: 'fa fa-check' });
          } catch (error) {
            this.toast.error("Gagal menghapus data jabatan", { icon: 'fa fa-times' });
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
      this.fetchPositions();
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
      this.fetchPositions();
    },
    resetFilters() {
      this.filters.namajabatan = '';
      
      this.sortColumn = 'namajabatan';
      this.sortDirection = 'asc';
      this.currentPage = 1;
      this.fetchPositions();
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