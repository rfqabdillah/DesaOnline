<template>
  <div class="col-sm-12">
    <add-edit-incoming-letter-modal
      v-if="isModalVisible"
      :incoming-letter-to-edit="incomingLetterBeingEdited"
      :user-id-desa="isSuperadmin ? null : userIdDesa"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <detail-incoming-letter-modal
      v-if="isDetailModalVisible"
      :incoming-letter-to-view="incomingLetterBeingViewed"
      @close="closeDetailModal"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Surat Masuk</h3>
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
            <div class="col-md-3">
              <label class="form-label">Nomor Surat</label>
              <input type="text" class="form-control" v-model="filters.nomor_surat" placeholder="Filter berdasarkan nomor surat">
            </div>
            <div class="col-md-3">
              <label class="form-label">Perihal</label>
              <input type="text" class="form-control" v-model="filters.perihal" placeholder="Filter berdasarkan perihal">
            </div>
            <div class="col-md-3">
              <label class="form-label">Pengirim</label>
              <input type="text" class="form-control" v-model="filters.pengirim" placeholder="Filter berdasarkan nama pengirim">
            </div>
            <div v-if="isSuperadmin" class="col-md-3">
              <label for="filterVillageName" class="form-label">Nama Desa</label>
              <input type="text" id="filterVillageName" class="form-control" v-model="filters.nama_wilayah" placeholder="Filter berdasarkan nama desa">
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
              <th scope="col" @click="sortBy('nomor_surat')">
                Nomor Surat <i class="fa" :class="getSortIcon('nomor_surat')"></i>
              </th>
              <th scope="col" @click="sortBy('perihal')">
                Perihal <i class="fa" :class="getSortIcon('perihal')"></i>
              </th>
              <th scope="col" @click="sortBy('pengirim')">
                Pengirim <i class="fa" :class="getSortIcon('pengirim')"></i>
              </th>
              <th scope="col" @click="sortBy('tanggal_surat')">
                Tanggal Surat <i class="fa" :class="getSortIcon('tanggal_surat')"></i>
              </th>
              <th scope="col" @click="sortBy('nama_wilayah')">
                Desa <i class="fa" :class="getSortIcon('nama_wilayah')"></i>
              </th>
              <th v-if="canPerformActions" scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in incomingLetters" :key="item.id_surat_masuk">
              <th scope="row">{{ (currentPage - 1) * perPage + index + 1 }}</th>
              <td>{{ item.nomor_surat || '-' }}</td>
              <td>{{ item.perihal || '-' }}</td>
              <td>{{ item.pengirim || '-' }}</td>
              <td>{{ formatTanggal(item.tanggal_surat) }}</td>
              <td>{{ item.wilayah?.nama_wilayah || '-' }}</td>
              <td v-if="canPerformActions">
                <div class="btn-group">
                  <button class="btn btn-success btn-sm" @click="openSuratFile(item.file_surat)" title="Lihat File Surat">
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
            <tr v-if="incomingLetters.length === 0">
              <td colspan="7" class="text-center">Tidak ada data yang cocok atau tersedia.</td>
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
import { deleteIncomingLetter, getIncomingLetters } from '@/services/general/documents/incomingLetters';
import { getProfiles } from '@/services/general/villageInformation/profile';
import AddEditIncomingLetterModal from './addEditIncomingLetterModal.vue';
import DetailIncomingLetterModal from './detailIncomingLetter.vue';
import { useToast } from "vue-toastification";

export default {
  components: { AddEditIncomingLetterModal, DetailIncomingLetterModal },
  data() {
    return {
      incomingLetters: [],
      desaList: [],
      sortColumn: 'created_at',
      sortDirection: 'asc',
      isModalVisible: false,
      currentPage: 1,
      perPage: 20,
      totalItems: 0,
      incomingLetterBeingEdited: null,
      incomingLetterBeingViewed: null,
      isDetailModalVisible: false,
      isFilterVisible: false,
      filters: {
        nomor_surat: '',
        perihal: '',
        pengirim: '',
        nama_wilayah: '',
      },
      toast: null,
      userRole: null,
      userIdDesa: null,
    };
  },
  computed: {
    isSuperadmin() {
      return this.userRole === 'Superadmin';
    },
    canPerformActions() {
      return this.userRole === 'Superadmin' || this.userRole === 'Operator'; 
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
    currentPage() { this.fetchIncomingLetters(); },
    perPage() { this.currentPage = 1; this.fetchIncomingLetters(); },
  },
  async mounted() {
    this.toast = useToast();
    this. loadUserData();
    await this.fetchDesaList();
    await this.fetchIncomingLetters();
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
      this.incomingLetterBeingEdited = null;
      this.isModalVisible = true;
    },
    openEditModal(item) {
      this.incomingLetterBeingEdited = { ...item };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.incomingLetterBeingEdited = null;
    },
    openDetailModal(item) {
      this.incomingLetterBeingViewed = { ...item };
      this.isDetailModalVisible = true;
    },
    closeDetailModal() {
      this.isDetailModalVisible = false;
      this.incomingLetterBeingViewed = null;
    },
    openSuratFile(fileUrl) {
      if (fileUrl) {
        window.open(fileUrl, '_blank');
      } else {
        this.toast.info("Tidak ada file surat yang tersedia.", { icon: 'fa fa-info-circle' });
      }
    },
    handleSaveSuccessful() {
      this.closeModal();
      this.fetchIncomingLetters();
    },
    async fetchIncomingLetters() {
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
        
        const response = await getIncomingLetters(params);
        const letterData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.[0]?.meta?.pagination || {};
        this.incomingLetters = letterData;
        this.totalItems = meta.total || letterData.length;
      } catch (error) {
        this.toast.error('Gagal memuat data surat masuk.');
      }
    },
    advancedDeleteAlert(item) {
      this.$swal({
        title: `Hapus Surat No. ${item.nomor_surat}?`,
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
            await deleteIncomingLetter(item.id_surat_masuk);
            this.toast.success("Data surat masuk berhasil dihapus");
            this.fetchIncomingLetters();
          } catch (error) {
            this.toast.error("Gagal menghapus data surat masuk");
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
      this.fetchIncomingLetters();
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
      this.fetchIncomingLetters();
    },
    resetFilters() {
      this.filters = {
        nomor_surat: '',
        perihal: '',
        pengirim: '',
        nama_wilayah: '',
      };
      this.sortColumn = 'created_at';
      this.sortDirection = 'asc';
      this.fetchIncomingLetters();
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