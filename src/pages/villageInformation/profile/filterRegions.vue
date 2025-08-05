<template>
  <div class="col-sm-12">
    <div class="card">
      <div class="card-header">
        <h3>Pilih Wilayah Desa</h3>
      </div>
      <div class="card-body">
        <div class="border p-3 mb-3 rounded filter-section">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="filterCode" class="form-label">Kode Wilayah</label>
              <input type="text" id="filterCode" class="form-control" v-model="filters.region_code" placeholder="Filter berdasarkan kode..." @keyup.enter="applyFilters">
            </div>
            <div class="col-md-4">
              <label for="filterName" class="form-label">Nama Wilayah</label>
              <input type="text" id="filterName" class="form-control" v-model="filters.region_name" placeholder="Filter berdasarkan nama..." @keyup.enter="applyFilters">
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
              <th scope="col" @click="sortBy('region_code')">
                Kode Wilayah
                <i class="fa fa-sort-asc" v-if="sortColumn === 'region_code' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'region_code' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" @click="sortBy('region_name')">
                Nama Wilayah
                <i class="fa fa-sort-asc" v-if="sortColumn === 'region_name' && sortDirection === 'asc'"></i>
                <i class="fa fa-sort-desc" v-else-if="sortColumn === 'region_name' && sortDirection === 'desc'"></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col">Tipe</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
                <td colspan="5" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </td>
            </tr>
            <tr v-else-if="paginatedRegions.length > 0" v-for="(item, index) in paginatedRegions" :key="item.region_id">
              <th scope="row">{{ (currentPage - 1) * perPage + index + 1 }}</th>
              <td>{{ item.region_code }}</td>
              <td>{{ item.region_name }}</td>
              <td>{{ item.region_type }}</td>
              <td>
                <button class="btn btn-success btn-sm" @click="selectRegion(item)">
                  <i class="fa fa-check me-1"></i> Pilih
                </button>
              </td>
            </tr>
            <tr v-else>
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
import { getRegions } from '@/services/referensi/regions';

export default {
  emits: ['region-selected'],
  data() {
    return {
      regions: [],
      sortColumn: '', 
      sortDirection: 'asc',
      currentPage: 1,
      perPage: 10, 
      totalItems: 0,
      isLoading: false,
      filters: {
        region_code: '',
        region_name: '',
      },
    };
  },
  computed: {
    paginatedRegions() {
      return this.regions;
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
      this.fetchRegions();
    },
    perPage() {
      this.currentPage = 1;
      this.fetchRegions();
    },
  },
  async mounted() {
    await this.fetchRegions();
  },
  methods: {
    selectRegion(item) {
      const selectedData = {
        id: item.region_id,     
        name: item.region_name, 
      };
      this.$emit('region-selected', selectedData);
    },
    async fetchRegions() {
      this.isLoading = true;
      try {
        const params = {
          page: this.currentPage,
          limit: this.perPage,
          order: this.sortColumn ? `${this.sortColumn} ${this.sortDirection}` : '',
        };

        const userFilters = Object.entries(this.filters)
          .filter(([, value]) => value && value.trim() !== '')
          .map(([key, value]) => `${key}=${value.trim()}`);
        
        const lockedFilter = 'region_type=D';
        const allFilters = [lockedFilter, ...userFilters];
        
        if (allFilters.length > 0) {
            params.filter = allFilters.join(',');
        }

        const response = await getRegions(params);
        
        const regionData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.meta?.pagination || response.data?.[0]?.meta?.pagination || {};

        this.regions = regionData;
        this.totalItems = meta.total || regionData.length;
        
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        this.isLoading = false;
      }
    },
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
      this.fetchRegions();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    applyFilters() {
      this.currentPage = 1;
      this.fetchRegions();
    },
    resetFilters() {
      this.filters.region_code = '';
      this.filters.region_name = '';
      this.currentPage = 1;
      this.sortColumn = 'region_code';
      this.sortDirection = 'asc';
      this.fetchRegions();
    },
  },
};
</script>

<style scoped>
th[scope="col"] {
  cursor: pointer;
  user-select: none;
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
  padding: 0.75rem;
  vertical-align: middle;
}
.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}
</style>