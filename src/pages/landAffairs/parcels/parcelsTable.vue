<template>
  <div class="col-sm-12">
    <add-edit-parcel-modal
      v-if="isModalVisible"
      :parcel-to-edit="parcelBeingEdited"
      :user-id-desa="isSuperAdmin ? null : userIdDesa"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <detail-parcel-modal
      v-if="isDetailModalVisible"
      :parcel-to-view="parcelBeingViewed"
      @close="closeDetailModal"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Persil Tanah</h3>
      </div>

      <div class="card-body">
        <div class="d-flex justify-content-end align-items-start mb-3">
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light txt-dark" @click="toggleFilterVisibility">
              <i v-if="isFilterVisible" class="fa fa-angle-up me-2"></i>
              <i v-else class="fa fa-angle-down me-2"></i>
              <span> {{ isFilterVisible ? 'Sembunyikan' : 'Tampilkan' }} Filter</span>
            </button>
            <button v-if="canPerformActions" class="btn btn-success" @click="openAddModal">
              <i class="fa fa-plus me-2"></i>
              <span> Tambah Data</span>
            </button>
          </div>
        </div>

        <div v-if="isFilterVisible" class="border p-3 mb-3 rounded filter-section">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="filterOwnerName" class="form-label">Nama Pemilik</label>
              <input type="text" id="filterOwnerName" class="form-control" v-model="filters.nama_pemilik" placeholder="Filter berdasarkan nama pemilik">
            </div>
            <div class="col-md-4">
              <label for="filterNik" class="form-label">NIK Pemilik</label>
              <input type="text" id="filterNik" class="form-control" v-model="filters.nik_pemilik" placeholder="Filter berdasarkan NIK">
            </div>
            <div v-if="isSuperadmin" class="col-md-4">
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
              <th scope="col" @click="sortBy('nama_pemilik')">
                Nama Pemilik <i class="fa" :class="getSortIcon('nama_pemilik')"></i>
              </th>
              <th scope="col" @click="sortBy('nik_pemilik')">
                NIK Pemilik <i class="fa" :class="getSortIcon('nik_pemilik')"></i>
              </th>
              <th scope="col" @click="sortBy('nomor_letter_c')">
                No. Letter C <i class="fa" :class="getSortIcon('nomor_letter_c')"></i>
              </th>
              <th scope="col" @click="sortBy('nama_wilayah')">
                Desa <i class="fa" :class="getSortIcon('nama_wilayah')"></i>
              </th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in parcels" :key="item.id_persil">
              <th scope="row">{{ (currentPage - 1) * perPage + index + 1 }}</th>
              <td>{{ item.nama_pemilik || '-' }}</td>
              <td>{{ item.nik_pemilik || '-' }}</td>
              <td>{{ item.nomor_letter_c || '-' }}</td>
              <td>{{ item.wilayah?.nama_wilayah || '-' }}</td>
              <td v-if="canPerformActions">
                <div class="btn-group">
                  <button class="btn btn-info btn-sm" @click="openDetailModal(item)" title="Lihat Detail">
                    <i class="fa fa-eye"></i>
                  </button>
                  <button class="btn btn-primary btn-sm" @click="openEditModal(item)">
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button class="btn btn-danger btn-sm" @click="advancedDeleteAlert(item)">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="parcels.length === 0">
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
import { deleteParcel, getParcels } from '@/services/general/landAffairs/parcels';
import { getProfiles } from '@/services/general/villageInformation/profile';
import AddEditParcelModal from './addEditParcelModal.vue';
import DetailParcelModal from './detailParcel.vue';
import { useToast } from "vue-toastification";

export default {
  components: { AddEditParcelModal, DetailParcelModal },
  data() {
    return {
      parcels: [],
      desaList: [],
      sortColumn: 'created_at',
      sortDirection: 'asc',
      isModalVisible: false,
      currentPage: 1,
      perPage: 20,
      totalItems: 0,
      parcelBeingEdited: null,
      isFilterVisible: false,
      filters: {
        nama_pemilik: '',
        nik_pemilik: '',
        id_desa: '',
      },
      toast: null,
      isDetailModalVisible: false,
      parcelBeingViewed: null,
      userRole: null,
      userIdDesa: null, 
    };
  },
  computed: {
    isSuperAdmin() {
      return this.userRole === 'Superadmin';
    },
    canPerformActions() {
      return this.userRole === 'Superadmin' || this.userRole === 'Operator'; 
    },
    paginatedParcels() {
      return this.parcels;
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
      this.fetchParcels();
    },
    perPage() {
      this.currentPage = 1;
      this.fetchParcels();
    },
  },
  async mounted() {
    this.toast = useToast();
    this.loadUserData();
    await this.fetchDesaList();
    await this.fetchParcels();
  },
  methods: {
    loadUserData() { 
      const userDataString = localStorage.getItem('userData'); 
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          const userProfile = userData?.data?.[0];
          if (userProfile) {
            this.userRole = userProfile.role?.nama_level;
            this.userIdDesa = userProfile.id_desa;
          }
        } catch (error) {
          console.error("Gagal mem-parsing data pengguna dari localStorage:", error);
          this.userRole = null; 
          this.userIdDesa = null;
        }
      }
    },
    async fetchDesaList() {
      try {
        const response = await getProfiles({ limit: -1 });
        this.desaList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar desa");
      }
    },
    openAddModal() {
      this.parcelBeingEdited = null;
      this.isModalVisible = true;
    },
    openEditModal(item) {
      this.parcelBeingEdited = { ...item };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.parcelBeingEdited = null;
    },
    openDetailModal(item) {
      this.parcelBeingViewed = { ...item };
      this.isDetailModalVisible = true;
    },
    closeDetailModal() {
      this.isDetailModalVisible = false;
      this.parcelBeingViewed = null;
    },
    handleSaveSuccessful() {
      this.closeModal();
      this.fetchParcels();
    },
    async fetchParcels() {
      try {
        const params = {
          page: this.currentPage,
          limit: this.perPage,
          order: this.sortColumn ? `${this.sortColumn} ${this.sortDirection}` : '',
        };
        const filterParts = Object.entries(this.filters)
          .filter(([, value]) => value !== '')
          .map(([key, value]) => `${key}=${value}`);
        
        if (!this.isSuperAdmin && this.userIdDesa) {
          filterParts.push(`id_desa=${this.userIdDesa}`);
        }
        
          if (filterParts.length > 0) {
          params.filter = filterParts.join(',');
        }
        
        const response = await getParcels(params);
        const parcelData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.[0]?.meta?.pagination || {};
        this.parcels = parcelData;
        this.totalItems = meta.total || parcelData.length;
      } catch (error) {
        console.error("Error fetching persil:", error);
        this.toast.error('Gagal memuat data persil.');
      }
    },
    advancedDeleteAlert(item) {
      this.$swal({
        title: `Hapus Persil Milik ${item.nama_pemilik}?`,
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
            await deleteParcel(item.id_persil);
            if (this.parcels.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            } else {
              this.fetchParcels();
            }
            this.toast.success("Data persil berhasil dihapus");
          } catch (error) {
            this.toast.error("Gagal menghapus data persil");
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
      this.fetchParcels();
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
      this.fetchParcels();
    },
    resetFilters() {
      this.filters = {
        nama_pemilik: '',
        nik_pemilik: '',
        id_desa: '',
      };
      this.sortColumn = 'created_at';
      this.sortDirection = 'asc';
      this.currentPage = 1;
      this.fetchParcels();
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