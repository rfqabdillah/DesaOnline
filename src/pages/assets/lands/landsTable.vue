<template>
  <div class="col-sm-12">
    <add-edit-land-modal
      v-if="isLandModalVisible"
      :land-to-edit="landBeingEdited"
      :user-id-desa="isSuperadmin ? null : userIdDesa"
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
    <detail-building-modal
      v-if="isDetailBuildingModalVisible"
      :building-to-view="buildingBeingViewed"
      @close="closeDetailBuildingModal"
    />
    <add-edit-room-modal
      v-if="isRoomModalVisible"
      :building-data="buildingForRoom"
      :room-to-edit="roomBeingEdited"
      @close="closeRoomModal"
      @save-successful="handleRoomSaveSuccessful"
    />
    <detail-room-modal
      v-if="isDetailRoomModalVisible"
      :room-to-view="roomBeingViewed"
      @close="closeDetailRoomModal"
    />

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3>Daftar Aset Tanah</h3>
        <button class="btn btn-success" @click="openAddLandModal">
          <i class="fa fa-plus me-2"></i>
          <span>Tambah Data Tanah</span>
        </button>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4 border-end">
            <h5 class="mb-3">Daftar Tanah</h5>
            <div class="d-flex justify-content-end mb-2">
              <button class="btn btn-sm btn-outline-light txt-dark" @click="toggleFilterVisibility">
                <i :class="isFilterVisible ? 'fa fa-angle-up' : 'fa fa-angle-down'" class="me-1"></i>
                Filter
              </button>
            </div>
            
            <div v-if="isFilterVisible" class="border p-3 mb-3 rounded filter-section">
              <div class="row g-2">
                <div class="col-12">
                  <label class="form-label">Nama Aset</label>
                  <input type="text" class="form-control" v-model="filters.namaaset" @keyup.enter="applyFilters" placeholder="Filter berdasarkan nama aset"/>
                </div>
                <div v-if="isSuperadmin" class="col-12">
                  <label class="form-label">Nama Desa</label>
                  <select class="form-select" v-model="filters.iddesa">
                    <option value="">Semua Desa</option>
                    <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                      {{ desa.wilayah.namawilayah }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="d-flex justify-content-end gap-2 mt-3">
                <button class="btn btn-sm btn-secondary" @click="resetFilters">
                  <i class="fa fa-refresh me-2"></i>
                <span>Reset Filter</span>
              </button>
                <button class="btn btn-sm btn-primary" @click="applyFilters">
                  <i class="fa fa-search me-2"></i>
                  <span>Terapkan Filter</span>
                </button>
              </div>
            </div>

            <div v-if="isLoading" class="text-center p-5">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2">Memuat data tanah...</p>
            </div>
            <div v-else>
              <ul v-if="landList.length > 0" class="list-group">
                <li
                  v-for="land in landList"
                  :key="land.idtanah"
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  :class="{ 'active': selectedLand && selectedLand.idtanah === land.idtanah }"
                  style="cursor: pointer"
                  @click="selectLand(land)"
                >
                  <div>
                    <span class="fw-bold">{{ land.namaaset }}</span>
                    <div class="text-muted small">Desa: {{ land.wilayah?.namawilayah || '-' }}</div>
                  </div>
                  <i class="fa fa-chevron-right"></i>
                </li>
              </ul>
              <p v-else class="text-center text-muted">Tidak ada data tanah.</p>
            </div>
            
            <div class="d-flex justify-content-center mt-3" v-if="!isLoading && landList.length > 0">
              <nav v-if="perPage !== -1 && totalPages > 1">
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }"><button class="page-link" @click="changePage(currentPage - 1)">‹</button></li>
                  <li class="page-item" v-for="page in pageNumbers" :key="page" :class="{ active: currentPage === page }"><button class="page-link" @click="changePage(page)">{{ page }}</button></li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }"><button class="page-link" @click="changePage(currentPage + 1)">›</button></li>
                </ul>
              </nav>
            </div>
            <div class="text-center mt-2" v-if="!isLoading && totalItems > 0">
              <span class="text-muted small">Menampilkan <strong> {{ (currentPage - 1) * perPage + 1 }} </strong> - <strong> {{ Math.min(currentPage * perPage, totalItems) }} </strong> dari <strong> {{ totalItems }} </strong> </span>
            </div>
          </div>

          <!--Panel Kanan-->
          <div class="col-md-8">
            <div v-if="!selectedLand" class="d-flex align-items-center justify-content-center h-100">
              <div class="text-center text-muted">
                <i class="fa fa-arrow-left fa-2x mb-3"></i>
                <p>Pilih sebuah aset tanah dari daftar di sebelah kiri untuk melihat detailnya.</p>
              </div>
            </div>
            <div v-else>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 class="mb-0">{{ selectedLand.namaaset }}</h4>
                  <p class="text-muted mb-0">Desa: {{ selectedLand.wilayah?.namawilayah || '-' }}</p>
                </div>
                <div class="btn-group">
                  <button class="btn btn-info btn-sm" @click="openDetailLandModal(selectedLand)"><i class="fa fa-eye"></i></button>
                  <button class="btn btn-primary btn-sm" @click="openEditLandModal(selectedLand)"><i class="fa fa-pencil"></i></button>
                  <button class="btn btn-danger btn-sm" @click="advancedDeleteLandAlert(selectedLand)"><i class="fa fa-trash"></i></button>
                </div>
              </div>

              <div class="accordion" id="assetAccordion">
                <div class="d-flex justify-content-between align-items-center p-2 border-bottom">
                  <h6 class="mb-0">Daftar Bangunan</h6>
                  <button class="btn btn-success btn-sm" @click="openAddBuildingModal(selectedLand)">
                    <i class="fa fa-plus"></i> Tambah Bangunan
                  </button>
                </div>

                <div v-if="loading.building[selectedLand.idtanah]" class="text-center p-3">
                  <div class="spinner-border spinner-border-sm"></div> Memuat Bangunan...
                </div>
                <div v-else-if="!subData.building[selectedLand.idtanah] || subData.building[selectedLand.idtanah].length === 0" class="p-3 text-center">
                  <p class="text-muted fst-italic">Belum ada data bangunan.</p>
                </div>
                
                <div class="accordion-item" v-for="building in subData.building[selectedLand.idtanah]" :key="building.idgedung">
                  <div class="d-flex justify-content-between align-items-center p-3">
                    <a href="#" @click.prevent="toggleExpand(building, 'building')" class="text-decoration-none text-dark d-flex align-items-center flex-grow-1">
                      <i class="fa fa-chevron-right me-2" :class="{ 'is-expanded': expanded.building[building.idgedung] }"></i>
                      <div>
                        {{ building.namagedung }}
                        <div class="text-muted small">Kode Aset: {{ building.kodeasetgedung || "-" }}</div>
                      </div>
                    </a>
                    <div class="btn-group">
                      <button class="btn btn-info btn-xs" title="Lihat Detail Bangunan" @click="openDetailBuildingModal(building)"><i class="fa fa-eye"></i></button>
                      <button class="btn btn-success btn-xs" title="Tambah Ruangan" @click="openAddRoomModal(building)"><i class="fa fa-plus"></i> Ruangan</button>
                      <button class="btn btn-primary btn-xs" title="Edit Bangunan" @click="openEditBuildingModal(building, selectedLand)"><i class="fa fa-pencil"></i></button>
                      <button class="btn btn-danger btn-xs" title="Hapus Bangunan" @click="advancedDeleteBuildingAlert(building, selectedLand)"><i class="fa fa-trash"></i></button>
                    </div>
                  </div>
                  
                  <div v-if="expanded.building[building.idgedung]" class="accordion-body p-2 border-top">
                    <div v-if="loading.room[building.idgedung]" class="text-center p-2"><div class="spinner-border spinner-border-sm text-secondary"></div> Memuat Ruangan...</div>
                    <div v-else-if="!subData.room[building.idgedung] || subData.room[building.idgedung].length === 0" class="text-muted fst-italic p-2 text-center">Belum ada data ruangan.</div>
                    <ul v-else class="list-group list-group-flush">
                      <li v-for="room in subData.room[building.idgedung]" :key="room.idruangan" class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          {{ room.namaruangan }}
                        </div>
                        <div class="btn-group">
                          <button class="btn btn-info btn-xs" title="Lihat Detail Ruangan" @click="openDetailRoomModal(room)"><i class="fa fa-eye"></i></button>
                          <button class="btn btn-primary btn-xs" title="Edit Ruangan" @click="openEditRoomModal(room, building)"><i class="fa fa-pencil"></i></button>
                          <button class="btn btn-danger btn-xs" title="Hapus Ruangan" @click="advancedDeleteRoomAlert(room, building)"><i class="fa fa-trash"></i></button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfiles } from "@/services/general/villageInformation/profile";
import { getLands, deleteLand } from "@/services/general/assets/lands";
import { getBuildings, deleteBuilding } from "@/services/general/assets/buildings";
import { getRooms, deleteRoom } from "@/services/general/assets/rooms";

import AddEditLandModal from "./addEditLandModal.vue";
import DetailLandModal from "./detailLand.vue";
import AddEditBuildingModal from "./addEditBuildingModal.vue";
import DetailBuildingModal from "./detailBuilding.vue";
import AddEditRoomModal from "./addEditRoomModal.vue";
import DetailRoomModal from "./detailRoom.vue";

import { useToast } from "vue-toastification";

export default {
  components: { 
    AddEditLandModal, DetailLandModal, 
    AddEditBuildingModal, DetailBuildingModal,
    AddEditRoomModal, DetailRoomModal
  },
  data() {
    return {
      landList: [],
      desaList: [],
      isLoading: false,
      sortColumn: "created_at",
      sortDirection: "asc",
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      selectedLand: null,
      isLandModalVisible: false,
      isDetailLandModalVisible: false,
      isBuildingModalVisible: false,
      isDetailBuildingModalVisible: false,
      isRoomModalVisible: false,
      isDetailRoomModalVisible: false,
      landBeingEdited: null,
      landBeingViewed: null,
      landForBuilding: null,
      buildingBeingEdited: null,
      buildingBeingViewed: null,
      buildingForRoom: null,
      roomBeingEdited: null,
      roomBeingViewed: null,
      expanded: { building: {} },
      loading: { building: {}, room: {} },
      subData: { building: {}, room: {} },
      isFilterVisible: false,
      filters: { 
        namaaset: "", 
        iddesa: "" 
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
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    },
  },
  watch: {
    currentPage() { 
      this.fetchLands(); 
    },
    perPage() { 
      this.currentPage = 1; this.fetchLands(); 
    },
  },
  async mounted() {
    this.toast = useToast();
    this.loadUserData();
    await this.fetchDesaList();
    await this.fetchLands();
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
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
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
    selectLand(land) {
      this.selectedLand = land;
      this.fetchBuildingsForLand(land.idtanah);
    },
    async fetchLands() {
      this.isLoading = true;
      this.selectedLand = null;
      try {
        const filterParts = Object.entries(this.filters)
          .filter(([, value]) => value)
          .map(([key, value]) => `${key}=${value}`);

        if (!this.isSuperAdmin && this.userIdDesa) {
          filterParts.push(`iddesa=${this.userIdDesa}`);
        }
        
        const params = {
          page: this.currentPage, 
          limit: this.perPage,
          order: this.sortColumn ? `${this.sortColumn} ${this.sortDirection}` : "",
          filter: filterParts.join(','), 
        };
        
        const response = await getLands(params);
        const data = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.[0]?.meta?.pagination || {};
        this.landList = data;
        this.totalItems = meta.total || data.length;

      } catch (error) {
        this.toast.error("Gagal memuat data tanah");
      } finally {
        this.isLoading = false;
      }
    },
    toggleExpand(item, level) {
      const id = level === 'building' ? item.idgedung : item.idruangan;
      this.expanded[level][id] = !this.expanded[level][id];
      if (level === "building" && this.expanded.building[id]) {
        this.fetchRoomsForBuilding(id);
      }
    },
    async fetchBuildingsForLand(idtanah) {
      if (this.subData.building[idtanah]) return;
      this.loading.building[idtanah] = true;
      try {
        const response = await getBuildings({ filter: `idtanah=${idtanah}`, limit: -1 });
        this.subData.building[idtanah] = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error(`Gagal memuat data bangunan.`);
        this.subData.building[idtanah] = [];
      } finally {
        this.loading.building[idtanah] = false;
      }
    },
    async fetchRoomsForBuilding(idgedung) {
      if (this.subData.room[idgedung]) return;
      this.loading.room[idgedung] = true;
      try {
        const response = await getRooms({ filter: `idgedung=${idgedung}`, limit: -1 });
        this.subData.room[idgedung] = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error(`Gagal memuat data ruangan.`);
        this.subData.room[idgedung] = [];
      } finally {
        this.loading.room[idgedung] = false;
      }
    },

    // --- Land Modals & Actions ---
    openAddLandModal() { 
      this.landBeingEdited = null; 
      this.isLandModalVisible = true; 
    },
    openEditLandModal(item) { 
      this.landBeingEdited = { ...item }; 
      this.isLandModalVisible = true; 
    },
    closeLandModal() { 
      this.isLandModalVisible = false; 
    },
    handleLandSaveSuccessful() { 
      this.closeLandModal();
      this.fetchLands(); 
    },
    openDetailLandModal(item) { 
      this.landBeingViewed = { ...item }; 
      this.isDetailLandModalVisible = true; 
    },
    closeDetailLandModal() { 
      this.isDetailLandModalVisible = false; 
      this.landBeingViewed = null; 
    },
    advancedDeleteLandAlert(land) {
      this.$swal({
        title: `Hapus Aset "${land.namaaset}"?`,
        text: "Semua data Bangunan dan Ruangan yang terkait juga akan terhapus. Aksi ini tidak dapat dibatalkan.",
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
            await deleteLand(land.idtanah);
            this.toast.success("Data tanah berhasil dihapus");
            this.fetchLands();
          } catch (error) { this.toast.error("Gagal menghapus data tanah"); }
        }
      });
    },

    // --- Building Modals & Actions ---
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
    },
    handleBuildingSaveSuccessful() {
      const idtanah = this.landForBuilding.idtanah;
      this.closeBuildingModal();
      delete this.subData.building[idtanah];
      this.fetchBuildingsForLand(idtanah);
    },
    openDetailBuildingModal(building) { 
      this.buildingBeingViewed = { ...building }; 
      this.isDetailBuildingModalVisible = true; 
    },
    closeDetailBuildingModal() { 
      this.isDetailBuildingModalVisible = false; this.buildingBeingViewed = null; 
    },
    advancedDeleteBuildingAlert(building, land) {
      this.$swal({
        title: `Hapus Bangunan "${building.namagedung}"?`,
        text: "Semua data Ruangan yang terkait juga akan terhapus. Aksi ini tidak dapat dibatalkan.",
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
            await deleteBuilding(building.idgedung);
            this.toast.success("Data bangunan berhasil dihapus");
            delete this.subData.building[land.idtanah];
            this.fetchBuildingsForLand(land.idtanah);
          } catch (error) { this.toast.error("Gagal menghapus data bangunan"); }
        }
      });
    },

    // --- Room Modals & Actions ---
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
    },
    handleRoomSaveSuccessful() {
      const idgedung = this.buildingForRoom.idgedung;
      this.closeRoomModal();
      delete this.subData.room[idgedung];
      this.fetchRoomsForBuilding(idgedung);
    },
    openDetailRoomModal(room) { 
      this.roomBeingViewed = { ...room }; this.isDetailRoomModalVisible = true; 
    },
    closeDetailRoomModal() { 
      this.isDetailRoomModalVisible = false; this.roomBeingViewed = null; 
    },
    advancedDeleteRoomAlert(room, building) {
      this.$swal({
        title: `Hapus Ruangan "${room.namaruangan}?""`,
        text: "Aksi ini tidak dapat dibatalkan.",
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
            await deleteRoom(room.idruangan);
            this.toast.success("Data ruangan berhasil dihapus");
            delete this.subData.room[building.idgedung];
            this.fetchRoomsForBuilding(building.idgedung);
          } catch (error) { this.toast.error("Gagal menghapus data ruangan"); }
        }
      });
    },
    
    toggleFilterVisibility() { 
      this.isFilterVisible = !this.isFilterVisible; 
    },
    applyFilters() { 
      this.currentPage = 1; this.fetchLands(); 
    },
    resetFilters() {
      this.filters = { namaaset: "", iddesa: "" };
      this.sortColumn = "created_at";
      this.sortDirection = "asc";
      this.currentPage = 1;
      this.fetchLands();
    },
  },
};
</script>

<style scoped>
.list-group-item-action { 
transition: background-color 0.2s ease-in-out; 
}
.filter-section { 
background-color: #f8f9fa; 
}
.btn-xs {
  --bs-btn-padding-y: .1rem;
  --bs-btn-padding-x: .4rem;
  --bs-btn-font-size: .75rem;
}
.is-expanded {
  transform: rotate(90deg);
  transition: transform 0.2s ease-in-out;
}
.list-group-item.active .text-muted {
  color: #fff !important;
}
</style>