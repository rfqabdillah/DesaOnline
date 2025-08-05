<template>
  <div class="col-sm-12">
    
    <add-edit-banner-modal
      v-if="isModalVisible"
      :banner-to-edit="bannerBeingEdited"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <!-- Image Viewer Modal -->
    <div v-if="isImageModalVisible" class="image-modal-overlay" @click="closeImageModal">
      <div class="image-modal-content" @click.stop>
        <div class="image-modal-header">
          <h5 class="image-modal-title">Pratinjau Gambar</h5>
          <button type="button" class="btn-close" @click="closeImageModal" aria-label="Close"></button>
        </div>
        <div class="image-modal-body">
          <!-- The draggable image -->
          <img 
            :src="selectedImageUrl" 
            :style="imageStyle" 
            alt="Pratinjau Banner"
            @mousedown="startDrag"
            @touchstart="startDrag"
            draggable="false"
          >
        </div>
        <div class="image-modal-footer">
          <button class="btn btn-outline-secondary btn-sm" @click="zoomOut" title="Perkecil">
            <i class="fa fa-search-minus"></i>
          </button>
          <button class="btn btn-outline-secondary btn-sm" @click="resetZoom" title="Reset Zoom">
            <i class="fa fa-refresh"></i>
          </button>
          <button class="btn btn-outline-secondary btn-sm" @click="zoomIn" title="Perbesar">
            <i class="fa fa-search-plus"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Daftar Banner</h3>
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
              <div class="col-md-4">
              <label for="filterBannerName" class="form-label">Nama Banner</label>
              <input type="text" id="filterBannerName" class="form-control" v-model="filters.namabanner" placeholder="Filter berdasarkan nama banner">
              </div>
              <div class="col-md-4">
              <label for="filterVillageName" class="form-label">Nama Desa</label>
              <input type="text" id="filterVillageName" class="form-control" v-model="filters.namawilayah" placeholder="Filter berdasarkan nama desa">
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
              <th scope="col" @click="sortBy('namabanner')">
                Nama Banner
                <i class="fa fa-sort-asc" v-if="sortColumn === 'namabanner' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'namabanner' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" style="width: 200px;">Gambar</th>
              <th scope="col" @click="sortBy('namawilayah')">
                Nama Desa
                <i class="fa fa-sort-asc" v-if="sortColumn === 'namawilayah' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'namawilayah' && sortDirection === 'desc'"></i>
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
              <tr v-for="(item, index) in banner" :key="item.idbanner">
                <th scope="row"> {{ (currentPage - 1) * perPage + index + 1 }}</th>
                <td>{{ item.namabanner|| '-' }}</td>
                <td>
                  <img 
                    :src="item.gambar" 
                    alt="Gambar" 
                    style="height: 50px; width: auto; cursor: pointer;" 
                    v-if="item.gambar"
                    @click="openImageModal(item.gambar)"
                  />
                  <span v-else class="text-muted">-</span>
                </td>
                <td>{{ item.wilayah.namawilayah || '-' }}</td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-primary btn-sm" @click="openEditModal(item)" title="Ubah Data">
                      <i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger sweet-11 btn-sm" type="button" @click="advancedDeleteAlert(item.idbanner)" title="Hapus Data">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedBanner.length === 0">
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
import { getBanner, deleteBanner } from '@/services/general/banner/banner'; 
import AddEditBannerModal from './addEditBannerModal.vue';
import { useToast } from "vue-toastification";

export default {
  components: { AddEditBannerModal }, 
  data() {
    return {
      banner: [],
      isLoading: false, 
      sortColumn: 'created_at',
      sortDirection: 'asc',
      isModalVisible: false,
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      bannerBeingEdited: null,
      isFilterVisible: false,
      filters: {
        namabanner: '', 
        namawilayah: '',
      },
      isImageModalVisible: false,
      selectedImageUrl: '',
      imageZoomLevel: 1,
      isDragging: false,
      startX: 0,
      startY: 0,
      translateX: 0,
      translateY: 0,
    };
  },
  computed: {
    paginatedBanner() {
      return this.banner;
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
    imageStyle() {
      return {
        transform: `scale(${this.imageZoomLevel}) translate(${this.translateX}px, ${this.translateY}px)`,
        transition: this.isDragging ? 'none' : 'transform 0.2s ease-in-out',
        maxWidth: '100%',
        maxHeight: '100%',
        cursor: this.isDragging ? 'grabbing' : 'grab', 
      };
    }
  },
  watch: {
    currentPage() {
      this.fetchBanner();
    },
    perPage() {
      this.currentPage = 1;
      this.fetchBanner();
    },
  },
  async mounted() {
    this.toast = useToast();
    await this.fetchBanner();
  },
  methods: {
    openAddModal() {
      this.bannerBeingEdited = null;
      this.isModalVisible = true;
    },
    openEditModal(item) {
      this.bannerBeingEdited = { ...item };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.bannerBeingEdited = null;
    },
    handleSaveSuccessful() {
      this.closeModal();
      this.fetchBanner();
    },
    
    openImageModal(imageUrl) {
      this.selectedImageUrl = imageUrl;
      this.isImageModalVisible = true;
    },
    closeImageModal() {
      this.isImageModalVisible = false;
      this.resetZoom(); 
      this.selectedImageUrl = '';
    },
    zoomIn() {
      this.imageZoomLevel += 0.1;
    },
    zoomOut() {
      if (this.imageZoomLevel > 0.2) {
        this.imageZoomLevel -= 0.1;
      }
    },
    resetZoom() {
      this.imageZoomLevel = 1;
      this.translateX = 0;
      this.translateY = 0;
    },

    startDrag(event) {
      event.preventDefault();
      this.isDragging = true;
      
      const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
      const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;

      this.startX = clientX - this.translateX;
      this.startY = clientY - this.translateY;
      
      window.addEventListener('mousemove', this.onDrag);
      window.addEventListener('mouseup', this.stopDrag);
      window.addEventListener('touchmove', this.onDrag, { passive: false }); 
      window.addEventListener('touchend', this.stopDrag);
    },
    onDrag(event) {
      if (!this.isDragging) return;
      if (event.type === 'touchmove') {
        event.preventDefault();
      }
      
      const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
      const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;

      this.translateX = clientX - this.startX;
      this.translateY = clientY - this.startY;
    },
    stopDrag() {
      this.isDragging = false;
      
      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.stopDrag);
      window.removeEventListener('touchmove', this.onDrag);
      window.removeEventListener('touchend', this.stopDrag);
    },

    async fetchBanner() {
      this.isLoading = true; 
      try {
        const params = {
          act: 'banner', 
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
        
        const response = await getBanner(params);
        const bannerData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.meta?.pagination || response.data?.[0]?.meta?.pagination || {};

        this.banner = bannerData;
        this.totalItems = meta.total || bannerData.length;
        
      } catch (error) {
        console.error("Error fetching banner:", error);
        this.toast.error("Gagal memuat data banner", { icon: 'fa fa-times' });
      } finally {
        this.isLoading = false; 
      }
    },
    advancedDeleteAlert(id) { 
      this.$swal({
        title: 'Hapus Data Banner',
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
            await deleteBanner(id); 
            if (this.banner.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            } else {
              this.fetchBanner();
            }
            this.toast.success("Data banner berhasil dihapus", { icon: 'fa fa-check' });
          } catch (error) {
            this.toast.error("Gagal menghapus data banner", { icon: 'fa fa-times' });
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
      this.fetchBanner();
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
      this.fetchBanner();
    },
    resetFilters() {
      this.filters.namabanner = '';
      this.filters.namawilayah = '';
      this.sortColumn = 'created_at'; 
      this.sortDirection = 'desc';
      this.currentPage = 1;
      this.fetchBanner();
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

/* Image Viewer Modal */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1050; /* Higher than most elements */
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  max-width: 90vw;
  max-height: 90vh;
  width: auto;
}

.image-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.image-modal-title {
  margin-bottom: 0;
  font-size: 1.25rem;
}

.image-modal-body {
  padding: 1rem;
  overflow: hidden; 
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.image-modal-footer {
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
</style>
