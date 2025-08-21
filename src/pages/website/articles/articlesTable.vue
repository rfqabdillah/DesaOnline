<template>
  <div class="col-sm-12">
    
    <add-edit-article-modal
      v-if="isModalVisible"
      :article-to-edit="articleBeingEdited"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <detail-article-modal
      v-if="isDetailModalVisible"
      :article-to-view="articleBeingViewed"
      @close="closeDetailModal"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Artikel</h3>
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
              <span> Tambah Artikel</span>
            </button>
          </div>
        </div>

        <div v-if="isFilterVisible" class="border p-3 mb-3 rounded filter-section">
            <div class="row g-3">
              <div class="col-md-3">
                <label for="filterTitle" class="form-label">Judul Artikel</label>
                <input type="text" id="filterTitle" class="form-control" v-model="filters.judul" placeholder="Filter berdasarkan judul">
              </div>
              <div class="col-md-3">
                <label for="filterCategory" class="form-label">Kategori Artikel</label>
                <select id="filterCategory" class="form-select" v-model="filters.idkategoriartikel">
                    <option value="">Semua Kategori</option>
                    <option v-for="category in categoryList" :key="category.idkategoriartikel" :value="category.idkategoriartikel">
                        {{ category.namakategoriartikel }}
                    </option>
                </select>
              </div>
              <div class="col-md-3">
                <label for="filterDate" class="form-label">Tanggal dibuat</label>
                <input type="date" id="filterDate" class="form-control" v-model="filters.created_at">
              </div>
              <div class="col-md-3">
                <label for="filterVillage" class="form-label">Nama Desa</label>
                <input type="text" id="filterVillage" class="form-control" v-model="filters.namawilayah" placeholder="Filter berdasarkan nama desa">
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
              <th scope="col" @click="sortBy('judul')">
                Judul Artikel
                <i class="fa fa-sort-asc" v-if="sortColumn === 'judul' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'judul' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" @click="sortBy('idkategoriartikel')">
                Kategori
                <i class="fa fa-sort-asc" v-if="sortColumn === 'idkategoriartikel' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'idkategoriartikel' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" @click="sortBy('namawilayah')">
                Nama Desa
                <i class="fa fa-sort-asc" v-if="sortColumn === 'namawilayah' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'namawilayah' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" @click="sortBy('created_at')">
                Tanggal Dibuat
                <i class="fa fa-sort-asc" v-if="sortColumn === 'created_at' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'created_at' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
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
              <tr v-for="(item, index) in articles" :key="item.idartikel">
                <th scope="row"> {{ (currentPage - 1) * perPage + index + 1 }}</th>
                <td>{{ item.judul || '-' }}</td>
                <td>{{ item.kategoriartikel?.nama_kategori_artikel || '-' }}</td>
                <td>{{ item.wilayah?.namawilayah || '-' }}</td>
                <td>{{ formatDate(item.created_at) }}</td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-info btn-sm" @click="openDetailModal(item)" title="Lihat Data">
                      <i class="fa fa-eye"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" @click="openEditModal(item)" title="Ubah Data">
                      <i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger sweet-11 btn-sm" type="button" @click="advancedDeleteAlert(item.idartikel)" title="Hapus Data">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="articles.length === 0">
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
import { getArticles, deleteArticle } from '@/services/general/website/article';
import { getArticleCategories } from '@/services/general/website/articleCategory'; 
import AddEditArticleModal from './addEditArticleModal.vue';
import DetailArticleModal from './detailArticle.vue';
import { useToast } from "vue-toastification";

export default {
  components: { AddEditArticleModal, DetailArticleModal }, 
  data() {
    return {
      articles: [],
      categoryList: [], 
      isLoading: false, 
      sortColumn: 'created_at',
      sortDirection: 'asc',
      isModalVisible: false,
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      articleBeingEdited: null,
      isFilterVisible: false,
      filters: {
        judul: '',
        idkategoriartikel: '',
        created_at: '',
        namawilayah: '',
      },
      isDetailModalVisible: false,
      articleBeingViewed: null,
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
    currentPage() {
      this.fetchArticles();
    },
    perPage() {
      this.currentPage = 1;
      this.fetchArticles();
    },
  },
  async mounted() {
    this.toast = useToast();
    await this.fetchCategoriesForFilter();
    await this.fetchArticles();
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } catch (e) {
        return dateString.split(' ')[0];
      }
    },
    openAddModal() {
      this.articleBeingEdited = null;
      this.isModalVisible = true;
    },
    openEditModal(item) {
      this.articleBeingEdited = { ...item };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.articleBeingEdited = null;
    },
    openDetailModal(item) {
      this.articleBeingViewed = { ...item };
      this.isDetailModalVisible = true;
    },
    closeDetailModal() {
      this.isDetailModalVisible = false;
      this.articleBeingViewed = null;
    },
    handleSaveSuccessful() {
      this.closeModal();
      this.fetchArticles();
    },
    async fetchCategoriesForFilter() {
        try {
            const response = await getArticleCategories({ limit: -1 });
            this.categoryList = response.data?.data || response.data?.[0]?.data || [];
        } catch (error) {
            this.toast.error("Gagal memuat daftar kategori artikel.");
        }
    },
    async fetchArticles() {
      this.isLoading = true; 
      try {
        const params = {
          act: 'artikel', 
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
        
        const response = await getArticles(params);
        const articleData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.meta?.pagination || response.data?.[0]?.meta?.pagination || {};

        this.articles = articleData;
        this.totalItems = meta.total || 0;
        
      } catch (error) {
        console.error("Error fetching articles:", error);
        this.toast.error("Gagal memuat data artikel", { icon: 'fa fa-times' });
      } finally {
        this.isLoading = false; 
      }
    },
    advancedDeleteAlert(id) { 
      this.$swal({
        title: 'Hapus Data Artikel',
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
            await deleteArticle(id); 
            if (this.articles.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            } else {
              this.fetchArticles();
            }
            this.toast.success("Data artikel berhasil dihapus", { icon: 'fa fa-check' });
          } catch (error) {
            this.toast.error("Gagal menghapus data artikel", { icon: 'fa fa-times' });
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
      this.fetchArticles();
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
      this.fetchArticles();
    },
    resetFilters() {
      this.filters.judul = '';
      this.filters.idkategoriartikel = '';
      this.filters.namawilayah = '';
      this.filters.created_at = '';
      this.currentPage = 1;
      this.fetchArticles();
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
