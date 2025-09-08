<template>
  <div class="col-sm-12">
    <add-edit-land-modal
      v-if="isLandModalVisible"
      :land-to-edit="landBeingEdited"
      @close="closeLandModal"
      @save-successful="handleLandSaveSuccessful"
    />
    <detail-land-modal
      v-if="isDetailLandModalVisible"
      :land-to-view="landBeingViewed"
      @close="closeDetailLandModal"
    />
    <add-edit-building-modal
      v-if="isBuildingModalVisible"
      :land-data="landForBuilding"
      :building-to-edit="buildingBeingEdited"
      @close="closeBuildingModal"
      @save-successful="handleBuildingSaveSuccessful"
    />
    <add-edit-room-modal
      v-if="isRoomModalVisible"
      :building-data="buildingForRoom"
      :room-to-edit="roomBeingEdited"
      @close="closeRoomModal"
      @save-successful="handleRoomSaveSuccessful"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Aset Tanah</h3>
      </div>
      <div class="card-body">
        <div class="d-flex justify-content-end align-items-start mb-3">
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light txt-dark" @click="toggleFilterVisibility">
              <i :class="isFilterVisible ? 'fa fa-angle-up' : 'fa fa-angle-down'" class="me-2"></i>
              <span>{{ isFilterVisible ? "Sembunyikan" : "Tampilkan" }} Filter</span>
            </button>
            <button class="btn btn-success" @click="openAddLandModal">
              <i class="fa fa-plus me-2"></i>
              <span>Tambah Data Tanah</span>
            </button>
          </div>
        </div>

        <div v-if="isFilterVisible" class="border p-3 mb-3 rounded filter-section">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="filterName" class="form-label">Nama Aset Tanah</label>
              <input type="text" id="filterName" class="form-control" v-model="filters.namaaset" placeholder="Filter berdasarkan nama aset" />
            </div>
            <div class="col-md-4">
              <label for="filterAddress" class="form-label">Lokasi</label>
              <input type="text" id="filterAddress" class="form-control" v-model="filters.lokasi" placeholder="Filter berdasarkan lokasi" />
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button class="btn btn-secondary" @click="resetFilters">
              <i class="fa fa-refresh me-2"></i><span>Reset Filter</span>
            </button>
            <button class="btn btn-primary" @click="applyFilters">
              <i class="fa fa-search me-2"></i><span>Terapkan Filter</span>
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" style="width: 5%">No</th>
              <th scope="col" @click="sortBy('namaaset')">
                Nama Aset Tanah
                <i class="fa" :class="getSortIcon('namaaset')"></i>
              </th>
              <th scope="col" @click="sortBy('lokasi')">
                Lokasi
                <i class="fa" :class="getSortIcon('lokasi')"></i>
              </th>
              <th scope="col" style="width: 20%">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="4" class="text-center p-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Memuat data...</p>
              </td>
            </tr>
            <template v-else-if="paginatedLands.length > 0">
              <template v-for="(land, index) in paginatedLands" :key="land.idland">
                <tr>
                  <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <button class="btn btn-expand flex-shrink-0" @click="toggleExpand(land, 'land')">
                        <i class="fa fa-chevron-right" :class="{ 'is-expanded': expanded.land[land.idland] }"></i>
                      </button>
                      <span class="fw-bold">{{ land.namaaset }}</span>
                    </div>
                  </td>
                  <td>{{ land.lokasi || "-" }}</td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-info btn-sm" @click="openDetailLandModal(land)">
                        <i class="fa fa-eye"></i>
                      </button>
                      <button class="btn btn-primary btn-sm" @click="openEditLandModal(land)">
                        <i class="fa fa-pencil"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="advancedDeleteLandAlert(land)">
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="expanded.land[land.idland]" class="nested-row">
                  <td :colspan="4" class="nested-content-cell">
                    <div v-if="loading.building[land.idland]" class="text-center p-3">
                      <div class="spinner-border spinner-border-sm"></div> Memuat Bangunan...
                    </div>
                    <div v-else-if="!subData.building[land.idland] || subData.building[land.idland].length === 0" class="p-3 text-center">
                      <p class="text-muted fst-italic mb-2">Belum ada data bangunan.</p>
                      <button class="btn btn-success btn-sm" @click="openAddBuildingModal(land)">
                        <i class="fa fa-plus"></i> Tambah Bangunan Pertama
                      </button>
                    </div>
                    <div v-else>
                      <ul class="list-group list-group-flush">
                        <li v-for="building in subData.building[land.idland]" :key="building.idbuilding" class="list-group-item px-0 py-2">
                          <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center gap-2">
                              <button class="btn btn-light btn-expand me-2" @click="toggleExpand(building, 'building')">
                                <i class="fa fa-chevron-right" :class="{ 'is-expanded': expanded.building[building.idbuilding] }"></i>
                              </button>
                              <span>{{ building.namagedung }} <span class="badge bg-secondary ms-1">Bangunan</span></span>
                            </div>
                            <div class="btn-group" role="group">
                              <button class="btn btn-success btn-xs" title="Tambah Ruangan" @click="openAddRoomModal(building)">
                                <i class="fa fa-plus"></i> Ruangan
                              </button>
                              <button class="btn btn-primary btn-xs" title="Edit Bangunan" @click="openEditBuildingModal(building, land)">
                                <i class="fa fa-pencil"></i>
                              </button>
                              <button class="btn btn-danger btn-xs" title="Hapus Bangunan" @click="advancedDeleteBuildingAlert(building, land)">
                                <i class="fa fa-trash"></i>
                              </button>
                            </div>
                          </div>

                          <div v-if="expanded.building[building.idbuilding]" class="nested-list ps-5 pt-2">
                            <div v-if="loading.room[building.idbuilding]" class="text-center p-2">
                              <div class="spinner-border spinner-border-sm text-secondary"></div> Memuat Ruangan...
                            </div>
                            <div v-else-if="!subData.room[building.idbuilding] || subData.room[building.idbuilding].length === 0" class="text-muted fst-italic p-2">
                              Belum ada data ruangan di bangunan ini.
                            </div>
                            <ul v-else class="list-group list-group-flush">
                              <li v-for="room in subData.room[building.idbuilding]" :key="room.idroom" class="list-group-item px-0 py-2">
                                <div class="d-flex justify-content-between align-items-center">
                                  <div class="d-flex align-items-center ps-4">
                                    <span>{{ room.namaruangan }} <span class="badge bg-info ms-1">Ruangan</span></span>
                                  </div>
                                  <div class="btn-group" role="group">
                                    <button class="btn btn-primary btn-xs" title="Edit Ruangan" @click="openEditRoomModal(room, building)">
                                      <i class="fa fa-pencil"></i>
                                    </button>
                                    <button class="btn btn-danger btn-xs" title="Hapus Ruangan" @click="advancedDeleteRoomAlert(room, building)">
                                      <i class="fa fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                      <div class="mt-3 text-end">
                        <button class="btn btn-outline-success btn-sm" @click="openAddBuildingModal(land)">
                          <i class="fa fa-plus"></i> Tambah Bangunan Baru
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </template>
            <tr v-else>
              <td colspan="4" class="text-center">Tidak ada data yang tersedia.</td>
            </tr>
          </tbody>
        </table>
      </div>
       <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-center mt-3 px-3 pb-3">
         <div class="mt-2">
           <span v-if="totalItems > 0" class="text-muted">
             Menampilkan <strong>{{ (currentPage - 1) * perPage + 1 }}</strong> -
             <strong>{{ Math.min(currentPage * perPage, totalItems) }}</strong>
             dari <strong>{{ totalItems }}</strong> data
           </span>
         </div>
         <nav v-if="perPage !== -1 && totalPages > 1" class="d-flex align-items-center flex-wrap gap-2 mt-2">
           <ul class="pagination mb-0">
             <li class="page-item" :class="{ disabled: currentPage === 1 }">
               <button class="page-link" @click="changePage(currentPage - 1)">Prev</button>
             </li>
             <li class="page-item" v-for="page in pageNumbers" :key="page" :class="{ active: currentPage === page }">
               <button class="page-link" @click="changePage(page)">{{ page }}</button>
             </li>
             <li class="page-item" :class="{ disabled: currentPage === totalPages }">
               <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
             </li>
           </ul>
         </nav>
       </div>
    </div>
  </div>
</template>

<script>
import { getLands, deleteLand } from "@/services/aset/tanah";
import { getBuildings, deleteBuilding } from "@/services/aset/bangunan";
import { getRooms, deleteRoom } from "@/services/aset/ruangan";

// MODIFIED: Import modal components with English names
import AddEditLandModal from "./addEditLandModal.vue";
import DetailLandModal from "./detailLand.vue";
import AddEditBuildingModal from "./addEditBuildingModal.vue";
import AddEditRoomModal from "./addEditRoomModal.vue";

import { useToast } from "vue-toastification";

export default {
  components: {
    // MODIFIED: Register components with English names
    AddEditLandModal,
    DetailLandModal,
    AddEditBuildingModal,
    AddEditRoomModal,
  },
  data() {
    return {
      // MODIFIED: Variable names are now in English
      landList: [],
      isLoading: false,
      sortColumn: "created_at",
      sortDirection: "asc",
      currentPage: 1,
      perPage: 10,
      totalItems: 0,

      isLandModalVisible: false,
      isDetailLandModalVisible: false,
      isBuildingModalVisible: false,
      isRoomModalVisible: false,

      landBeingEdited: null,
      landBeingViewed: null,
      landForBuilding: null,
      buildingBeingEdited: null,
      buildingForRoom: null,
      roomBeingEdited: null,

      expanded: {
        land: {},
        building: {},
      },
      loading: {
        building: {},
        room: {},
      },
      subData: {
        building: {},
        room: {},
      },

      isFilterVisible: false,
      filters: {
        namaaset: "",
        lokasi: "",
      },
      toast: null,
    };
  },
  computed: {
    paginatedLands() {
      return this.landList;
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
    currentPage() { this.fetchLands(); },
    perPage() {
      this.currentPage = 1;
      this.fetchLands();
    },
  },
  async mounted() {
    this.toast = useToast();
    await this.fetchLands();
  },
  methods: {
    // MODIFIED: All methods are renamed and updated to use English variables
    async fetchLands() {
      this.isLoading = true;
      try {
        let filterParts = [];
        if (this.filters.namaaset) filterParts.push(`namaaset=${this.filters.namaaset}`);
        if (this.filters.lokasi) filterParts.push(`lokasi=${this.filters.lokasi}`);
        
        const params = {
          page: this.currentPage,
          limit: this.perPage,
          order: this.sortColumn ? `${this.sortColumn} ${this.sortDirection}` : "",
          filter: filterParts.join('&'),
        };
        const response = await getLands(params);
        const data = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.[0]?.meta?.pagination || {};
        this.landList = data;
        this.totalItems = meta.total || data.length;
      } catch (error) {
        this.toast.error("Gagal memuat data tanah.");
      } finally {
        this.isLoading = false;
      }
    },
    async fetchBuildingsForLand(idland) {
      if (this.subData.building[idland]) return;
      this.loading.building[idland] = true;
      try {
        const response = await getBuildings({ filter: `idland=${idland}`, limit: -1 });
        this.subData.building[idland] = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error(`Gagal memuat data bangunan.`);
        this.subData.building[idland] = [];
      } finally {
        this.loading.building[idland] = false;
      }
    },
    async fetchRoomsForBuilding(idbuilding) {
      if (this.subData.room[idbuilding]) return;
      this.loading.room[idbuilding] = true;
      try {
        const response = await getRooms({ filter: `idbuilding=${idbuilding}`, limit: -1 });
        this.subData.room[idbuilding] = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error(`Gagal memuat data ruangan.`);
        this.subData.room[idbuilding] = [];
      } finally {
        this.loading.room[idbuilding] = false;
      }
    },
    toggleExpand(item, level) {
      const id = level === 'land' ? item.idland : item.idbuilding;
      this.expanded[level][id] = !this.expanded[level][id];
      
      if (level === "land" && this.expanded.land[id]) {
        this.fetchBuildingsForLand(id);
      } else if (level === "building" && this.expanded.building[id]) {
        this.fetchRoomsForBuilding(id);
      }
    },

    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortDirection = "asc";
      }
      this.fetchLands();
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
    
    // --- Land Methods ---
    openAddLandModal() {
      this.landBeingEdited = null;
      this.isLandModalVisible = true;
    },
    openEditLandModal(item) {
      this.landBeingEdited = item;
      this.isLandModalVisible = true;
    },
    closeLandModal() { this.isLandModalVisible = false; },
    handleLandSaveSuccessful() {
      this.closeLandModal();
      this.fetchLands();
    },
    openDetailLandModal(item) {
      this.landBeingViewed = { ...item };
      this.isDetailLandModalVisible = true;
    },
    closeDetailLandModal() { this.isDetailLandModalVisible = false; },
    advancedDeleteLandAlert(land) {
      this.$swal({
        title: `Hapus Aset Tanah ${land.namaaset}?`,
        text: "Semua bangunan dan ruangan terkait juga akan terhapus. Aksi ini tidak dapat dibatalkan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33",
        cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteLand(land.idland);
            this.fetchLands();
            this.toast.success("Data tanah berhasil dihapus.");
          } catch (error) {
            this.toast.error("Gagal menghapus data tanah.");
          }
        }
      });
    },

    // --- Building Methods ---
    openAddBuildingModal(land) {
      this.buildingBeingEdited = null;
      this.landForBuilding = land;
      this.isBuildingModalVisible = true;
    },
    openEditBuildingModal(building, land) {
      this.buildingBeingEdited = building;
      this.landForBuilding = land;
      this.isBuildingModalVisible = true;
    },
    closeBuildingModal() {
      this.isBuildingModalVisible = false;
      this.buildingBeingEdited = null;
      this.landForBuilding = null;
    },
    handleBuildingSaveSuccessful() {
      const idland = this.landForBuilding.idland;
      this.closeBuildingModal();
      delete this.subData.building[idland];
      this.fetchBuildingsForLand(idland);
    },
    advancedDeleteBuildingAlert(building, land) {
       this.$swal({
        title: `Hapus Bangunan ${building.namagedung}?`,
        text: "Semua ruangan terkait juga akan terhapus. Aksi ini tidak dapat dibatalkan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33",
        cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteBuilding(building.idbuilding);
            this.toast.success("Data bangunan berhasil dihapus.");
            delete this.subData.building[land.idland];
            this.fetchBuildingsForLand(land.idland);
          } catch (error) {
            this.toast.error("Gagal menghapus data bangunan.");
          }
        }
      });
    },

    // --- Room Methods ---
    openAddRoomModal(building) {
      this.roomBeingEdited = null;
      this.buildingForRoom = building;
      this.isRoomModalVisible = true;
    },
    openEditRoomModal(room, building) {
      this.roomBeingEdited = room;
      this.buildingForRoom = building;
      this.isRoomModalVisible = true;
    },
    closeRoomModal() {
      this.isRoomModalVisible = false;
      this.roomBeingEdited = null;
      this.buildingForRoom = null;
    },
    handleRoomSaveSuccessful() {
      const idbuilding = this.buildingForRoom.idbuilding;
      this.closeRoomModal();
      delete this.subData.room[idbuilding];
      this.fetchRoomsForBuilding(idbuilding);
    },
    advancedDeleteRoomAlert(room, building) {
       this.$swal({
        title: `Hapus Ruangan ${room.namaruangan}?`,
        text: "Aksi ini tidak dapat dibatalkan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33",
        cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteRoom(room.idroom);
            this.toast.success("Data ruangan berhasil dihapus.");
            delete this.subData.room[building.idbuilding];
            this.fetchRoomsForBuilding(building.idbuilding);
          } catch (error) {
            this.toast.error("Gagal menghapus data ruangan.");
          }
        }
      });
    },
    
    toggleFilterVisibility() { this.isFilterVisible = !this.isFilterVisible; },
    applyFilters() {
      this.currentPage = 1;
      this.fetchLands();
    },
    resetFilters() {
      this.filters.namaaset = "";
      this.filters.lokasi = "";
      this.sortColumn = "created_at";
      this.sortDirection = "asc";
      this.currentPage = 1;
      this.fetchLands();
    },
  },
};
</script>

<style scoped>
/* Styles remain unchanged */
.table th, .table td { vertical-align: middle; }
.nested-row > td { border-top: 0 !important; }
.nested-content-cell {
  padding: 0.5rem 1rem 1rem 3rem !important;
  background-color: #f8f9fa;
  box-shadow: inset 3px 0px 5px -2px rgba(0, 0, 0, 0.05);
}
.nested-list { margin-left: 1rem; padding-left: 1rem; }
.list-group-item { border: 0; background-color: transparent; }
.btn-xs {
  --bs-btn-padding-y: 0.1rem;
  --bs-btn-padding-x: 0.5rem;
  --bs-btn-font-size: 0.75rem;
}
.btn-expand {
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
}
.btn-expand:hover { background-color: #e9ecef !important; }
.btn-expand:focus, .btn-expand:active { outline: none !important; box-shadow: none !important; }
.btn-expand i {
  margin: 0;
  padding: 0;
  line-height: 1;
  transition: transform 0.2s ease-in-out;
}
.btn-expand i.is-expanded { transform: rotate(90deg); }
</style>