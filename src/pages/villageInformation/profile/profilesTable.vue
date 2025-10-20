<template>
  <div class="col-sm-12">
    <add-edit-profile-modal
      v-if="isProfileModalVisible"
      :profile-to-edit="profileBeingEdited"
      :user-id-desa="isSuperadmin ? null : userIdDesa"
      @close="closeProfileModal"
      @save-successful="handleProfileSaveSuccessful"
    />
    <detail-profile-modal
      v-if="isDetailModalVisible"
      :profile-to-view="profileBeingViewed"
      @close="closeDetailModal"
    />
    <add-edit-dusun-modal
      v-if="isDusunModalVisible"
      :profile-data="profileForDusun"
      :dusun-to-edit="dusunBeingEdited"
      @close="closeDusunModal"
      @save-successful="handleDusunSaveSuccessful"
    />
    <add-edit-rw-modal
      v-if="isRwModalVisible"
      :dusun-data="dusunForRw"
      :rw-to-edit="rwBeingEdited"
      @close="closeRwModal"
      @save-successful="handleRwSaveSuccessful"
    />
    <add-edit-rt-modal
      v-if="isRtModalVisible"
      :rw-data="rwForRt"
      :rt-to-edit="rtBeingEdited"
      @close="closeRtModal"
      @save-successful="handleRtSaveSuccessful"
    />

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3>Daftar Profil Desa</h3>
        <button v-if="canPerformActions" class="btn btn-success" @click="openAddProfileModal">
          <i class="fa fa-plus me-2"></i>
          <span>Tambah Data Desa</span>
        </button>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4 border-end">
            <h5 class="mb-3">Daftar Desa</h5>
            <div class="d-flex justify-content-end mb-2">
              <button class="btn btn-sm btn-outline-light txt-dark" @click="toggleFilterVisibility">
                <i :class="isFilterVisible ? 'fa fa-angle-up' : 'fa fa-angle-down'" class="me-1"></i>
                Filter
              </button>
            </div>
            <div v-if="isFilterVisible" class="border p-3 mb-3 rounded filter-section">
              <div class="row g-2">
                <div v-if="isSuperadmin" class="col-12">
                  <label for="filterName" class="form-label">Nama Desa</label>
                  <input type="text" id="filterName" class="form-control" v-model="filters.namawilayah" @keyup.enter="applyFilters" placeholder="Filter berdasarkan nama desa"/>
                </div>
                <div class="col-12">
                  <label for="filterAddress" class="form-label">Alamat Kantor</label>
                  <input type="text" id="filterAddress" class="form-control" v-model="filters.alamatkantor" @keyup.enter="applyFilters" placeholder="flter berdasarkan alamat"/>
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
              <p class="mt-2">Memuat data desa...</p>
            </div>
            <div v-else>
              <ul v-if="profiles.length > 0" class="list-group">
                <li
                  v-for="profile in profiles"
                  :key="profile.iddesa"
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  :class="{ 'active': selectedDesa && selectedDesa.iddesa === profile.iddesa }"
                  style="cursor: pointer"
                  @click="selectDesa(profile)"
                >
                  <div class="d-flex align-items-center">
                    <img
                      v-if="profile.logo"
                      :src="profile.logo"
                      alt="Logo"
                      class="me-3 rounded"
                      style="height: 32px; width: 32px; object-fit: contain;"
                    />
                    <div v-else class="logo-placeholder me-3">
                      <i class="fa fa-image text-muted"></i>
                    </div>
                    <span>{{ profile.wilayah.namawilayah }}</span>
                  </div>
                  <i class="fa fa-chevron-right"></i>
                </li>
              </ul>
              <p v-else class="text-center text-muted">Tidak ada data desa.</p>
            </div>
            <div class="d-flex justify-content-center mt-3" v-if="!isLoading && profiles.length > 0">
              <nav v-if="perPage !== -1 && totalPages > 1" >
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">‹</button>
                  </li>
                  <li class="page-item" v-for="page in pageNumbers" :key="page" :class="{ active: currentPage === page }">
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">›</button>
                  </li>
                </ul>
              </nav>
            </div>
            <div class="text-center mt-2" v-if="!isLoading && totalItems > 0">
              <span class="text-muted small">
                Menampilkan <strong>{{ (currentPage - 1) * perPage + 1 }}</strong> -
                <strong>{{ Math.min(currentPage * perPage, totalItems) }}</strong>
                dari <strong>{{ totalItems }}</strong>
              </span>
            </div>
          </div>

          <div class="col-md-8">
            <div v-if="!selectedDesa" class="d-flex align-items-center justify-content-center h-100">
              <div class="text-center text-muted">
                <i class="fa fa-arrow-left fa-2x mb-3"></i>
                <p>Pilih sebuah desa dari daftar di sebelah kiri untuk melihat detailnya.</p>
              </div>
            </div>
            <div v-else>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 class="mb-0">{{ selectedDesa.wilayah.namawilayah }}</h4>
                  <p class="text-muted mb-0">{{ selectedDesa.alamatkantor || 'Alamat belum diatur' }}</p>
                </div>
                <div class="btn-group">
                  <button class="btn btn-info btn-sm" @click="openDetailModal(selectedDesa)"><i class="fa fa-eye"></i></button>
                  <button class="btn btn-primary btn-sm" @click="openEditProfileModal(selectedDesa)"><i class="fa fa-pencil"></i></button>
                  <button class="btn btn-danger btn-sm" @click="advancedDeleteAlert(selectedDesa.iddesa)"><i class="fa fa-trash"></i></button>
                </div>
              </div>

              <div class="accordion" id="wilayahAccordion">
                <div class="d-flex justify-content-between align-items-center p-2 border-bottom">
                  <h6 class="mb-0">Struktur Wilayah</h6>
                  <button class="btn btn-success btn-sm" @click="openAddDusunModal(selectedDesa)">
                    <i class="fa fa-plus"></i> Tambah Dusun
                  </button>
                </div>

                <div v-if="loading.dusun[selectedDesa.iddesa]" class="text-center p-3">
                  <div class="spinner-border spinner-border-sm"></div> Memuat Dusun...
                </div>
                <div v-else-if="!subData.dusun[selectedDesa.iddesa] || subData.dusun[selectedDesa.iddesa].length === 0" class="p-3 text-center">
                  <p class="text-muted fst-italic">Belum ada data dusun.</p>
                </div>
                
                <div class="accordion-item" v-for="dusun in subData.dusun[selectedDesa.iddesa]" :key="dusun.iddusun">
                    <div class="d-flex justify-content-between align-items-center p-3">
                        <a href="#" @click.prevent="toggleExpand(dusun, 'dusun')" class="text-decoration-none text-dark d-flex align-items-center flex-grow-1">
                            <i class="fa fa-chevron-right me-2" :class="{ 'is-expanded': expanded.dusun[dusun.iddusun] }"></i>
                            <div>
                                {{ dusun.namadusun }}
                                <div class="text-muted small">Kepala Dusun: {{ dusun.kadus?.namakepaladusun || "-" }}</div>
                            </div>
                        </a>
                        <div class="btn-group">
                            <button class="btn btn-success btn-xs" title="Tambah RW" @click="openAddRwModal(dusun)"><i class="fa fa-plus"></i> RW</button>
                            <button class="btn btn-primary btn-xs" title="Edit Dusun" @click="openEditDusunModal(dusun, selectedDesa)"><i class="fa fa-pencil"></i></button>
                            <button class="btn btn-danger btn-xs" title="Hapus Dusun" @click="advancedDeleteDusunAlert(dusun, selectedDesa)"><i class="fa fa-trash"></i></button>
                        </div>
                    </div>
                    
                    <div v-if="expanded.dusun[dusun.iddusun]" class="accordion-body p-2 border-top">
                        <div v-if="loading.rw[dusun.iddusun]" class="text-center p-2"><div class="spinner-border spinner-border-sm text-secondary"></div> Memuat RW...</div>
                        <div v-else-if="!subData.rw[dusun.iddusun] || subData.rw[dusun.iddusun].length === 0" class="text-muted fst-italic p-2 text-center">Belum ada data RW.</div>
                        <ul v-else class="list-group list-group-flush">
                            <li v-for="rw in subData.rw[dusun.iddusun]" :key="rw.idrw" class="list-group-item">
                                <div class="d-flex justify-content-between align-items-center">
                                    <a href="#" @click.prevent="toggleExpand(rw, 'rw')" class="text-decoration-none text-dark d-flex align-items-center">
                                        <i class="fa fa-chevron-right me-2" :class="{ 'is-expanded': expanded.rw[rw.idrw] }"></i>
                                        <div>
                                            {{ rw.namarw }}
                                            <div class="text-muted small">Ketua RW: {{ rw.ketuarw?.namaketuarw || '-' }}</div>
                                        </div>
                                    </a>
                                    <div class="btn-group">
                                        <button class="btn btn-success btn-xs" title="Tambah RT" @click="openAddRtModal(rw)"><i class="fa fa-plus"></i> RT</button>
                                        <button class="btn btn-primary btn-xs" title="Edit RW" @click="openEditRwModal(rw, dusun)"><i class="fa fa-pencil"></i></button>
                                        <button class="btn btn-danger btn-xs" title="Hapus RW" @click="advancedDeleteRwAlert(rw, dusun)"><i class="fa fa-trash"></i></button>
                                    </div>
                                </div>
                                <div v-if="expanded.rw[rw.idrw]" class="ps-4 mt-2">
                                    <div v-if="loading.rt[rw.idrw]" class="text-center p-2"><div class="spinner-border spinner-border-sm text-success"></div> Memuat RT...</div>
                                    <div v-else-if="!subData.rt[rw.idrw] || subData.rt[rw.idrw].length === 0" class="text-muted fst-italic p-2">Belum ada data RT.</div>
                                    <ul v-else class="list-group">
                                        <li v-for="rt in subData.rt[rw.idrw]" :key="rt.idrt" class="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                {{ rt.namart }}
                                                <div class="text-muted small">Ketua RT: {{ rt.ketuart?.namaketuart || '-' }}</div>
                                            </div>
                                            <div class="btn-group">
                                                <button class="btn btn-primary btn-xs" title="Edit RT" @click="openEditRtModal(rt, rw)"><i class="fa fa-pencil"></i></button>
                                                <button class="btn btn-danger btn-xs" title="Hapus RT" @click="advancedDeleteRtAlert(rt, rw)"><i class="fa fa-trash"></i></button>
                                            </div>
                                        </li>
                                    </ul>
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
import { getProfiles, deleteProfile } from "@/services/general/villageInformation/profile";
import { getDusuns, deleteDusun } from "@/services/general/villageInformation/dusun";
import { getRw, deleteRw } from "@/services/general/villageInformation/rw";
import { getRt, deleteRt } from "@/services/general/villageInformation/rt";
import AddEditProfileModal from "./addEditProfileModal.vue";
import DetailProfileModal from "./detailProfile.vue";
import AddEditDusunModal from "./addEditDusunModal.vue";
import AddEditRwModal from "./addEditRwModal.vue";
import AddEditRtModal from "./addEditRtModal.vue";
import { useToast } from "vue-toastification";

export default {
  components: {
    AddEditProfileModal, DetailProfileModal, AddEditDusunModal,
    AddEditRwModal, AddEditRtModal,
  },
  data() {
    return {
      profiles: [],
      isLoading: false,
      sortColumn: "created_at",
      sortDirection: "asc",
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      selectedDesa: null,
      isProfileModalVisible: false, isDetailModalVisible: false,
      isDusunModalVisible: false, isRwModalVisible: false, isRtModalVisible: false,
      profileBeingEdited: null, profileBeingViewed: null, profileForDusun: null,
      dusunBeingEdited: null, dusunForRw: null, rwBeingEdited: null,
      rwForRt: null, rtBeingEdited: null,
      expanded: { dusun: {}, rw: {} },
      loading: { dusun: {}, rw: {}, rt: {} },
      subData: { dusun: {}, rw: {}, rt: {} },
      isFilterVisible: false,
      filters: { namawilayah: "", alamatkantor: "" },
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
    currentPage() { this.fetchProfiles(); },
    perPage() { this.currentPage = 1; this.fetchProfiles(); },
  },
  async mounted() {
    this.toast = useToast();
    this.loadUserData(); 
    await this.fetchProfiles();
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
    selectDesa(profile) {
      this.selectedDesa = profile;
      this.fetchDusunForDesa(profile.iddesa);
    },
    async fetchProfiles() {
      this.isLoading = true;
      this.selectedDesa = null;
      try {

        const filterParts = [];

        if (this.filters.namawilayah) {
          filterParts.push(`namawilayah=${this.filters.namawilayah}`);
        }
        if (this.filters.alamatkantor) {
          filterParts.push(`alamatkantor=${this.filters.alamatkantor}`);
        }

        if (!this.isSuperadmin && this.userIdDesa) {
          filterParts.push(`iddesa=${this.userIdDesa}`);
        }

        const params = {
          page: this.currentPage,
          limit: this.perPage,
          order: this.sortColumn ? `${this.sortColumn} ${this.sortDirection}` : "",
          filter: filterParts.join(','),
        };

        const response = await getProfiles(params);
        const profileData = response.data?.data || response.data?.[0]?.data || [];
        const meta = response.data?.[0]?.meta?.pagination || {};
        
        this.profiles = profileData;
        this.totalItems = meta.total || profileData.length;

      } catch (error) {
        this.toast.error("Gagal memuat data desa");
      } finally {
        this.isLoading = false;
      }
    },
    async fetchDusunForDesa(id_desa) {
      if (this.subData.dusun[id_desa]) return;
      this.loading.dusun[id_desa] = true;
      try {
        const response = await getDusuns({ filter: `iddesa=${id_desa}`, limit: -1 });
        this.subData.dusun[id_desa] = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error(`Gagal memuat data dusun`);
        this.subData.dusun[id_desa] = [];
      } finally {
        this.loading.dusun[id_desa] = false;
      }
    },
    async fetchRwForDusun(id_dusun) {
      if (this.subData.rw[id_dusun]) return;
      this.loading.rw[id_dusun] = true;
      try {
        const response = await getRw({ filter: `iddusun=${id_dusun}`, limit: -1 });
        this.subData.rw[id_dusun] = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error(`Gagal memuat data RW.`);
        this.subData.rw[id_dusun] = [];
      } finally {
        this.loading.rw[id_dusun] = false;
      }
    },
    async fetchRtForRw(id_rw) {
      if (this.subData.rt[id_rw]) return;
      this.loading.rt[id_rw] = true;
      try {
        const response = await getRt({ filter: `idrw=${id_rw}`, limit: -1 });
        this.subData.rt[id_rw] = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error(`Gagal memuat data RT.`);
        this.subData.rt[id_rw] = [];
      } finally {
        this.loading.rt[id_rw] = false;
      }
    },
    toggleExpand(item, level) {
      const id = item[`id${level}`];
      this.expanded[level][id] = !this.expanded[level][id];
      if (level === "dusun" && this.expanded.dusun[id]) { this.fetchRwForDusun(id); }
      if (level === "rw" && this.expanded.rw[id]) { this.fetchRtForRw(id); }
    },
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column; this.sortDirection = "asc";
      }
      this.fetchProfiles();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) { this.currentPage = page; }
    },
    openAddDusunModal(profile) {
      this.dusunBeingEdited = null; this.profileForDusun = profile; this.isDusunModalVisible = true;
    },
    openEditDusunModal(dusun, profile) {
      this.dusunBeingEdited = dusun; this.profileForDusun = profile; this.isDusunModalVisible = true;
    },
    closeDusunModal() {
      this.isDusunModalVisible = false; this.dusunBeingEdited = null; this.profileForDusun = null;
    },
    handleDusunSaveSuccessful() {
      const id_desa = this.profileForDusun.iddesa;
      this.closeDusunModal();
      delete this.subData.dusun[id_desa];
      this.fetchDusunForDesa(id_desa);
    },
    advancedDeleteDusunAlert(dusun, profile) {
      this.$swal({
        title: `Hapus Dusun ${dusun.namadusun}?`,
        text: "Data RW dan RT yang terkait juga akan terhapus. Aksi ini tidak dapat dibatalkan.",
        icon: "warning", showCancelButton: true, confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33", cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
        cancelButtonColor: "#efefef", reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteDusun(dusun.iddusun);
            this.toast.success("Data dusun berhasil dihapus.");
            delete this.subData.dusun[profile.iddesa];
            this.fetchDusunForDesa(profile.iddesa);
          } catch (error) { this.toast.error("Gagal menghapus data dusun."); }
        }
      });
    },
    openAddProfileModal() {
      this.profileBeingEdited = null; this.isProfileModalVisible = true;
    },
    openEditProfileModal(item) {
      this.profileBeingEdited = item; this.isProfileModalVisible = true;
    },
    closeProfileModal() { this.isProfileModalVisible = false; },
    handleProfileSaveSuccessful() {
      this.closeProfileModal(); this.fetchProfiles();
    },
    openDetailModal(item) {
      this.profileBeingViewed = { ...item }; this.isDetailModalVisible = true;
    },
    closeDetailModal() { this.isDetailModalVisible = false; },
    advancedDeleteAlert(id) {
      this.$swal({
        title: "Hapus Data Profil Desa", text: "Apakah Anda yakin ingin menghapus data ini?",
        icon: "warning", showCancelButton: true, confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33", cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
        cancelButtonColor: "#efefef", reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteProfile(id); this.fetchProfiles();
            this.toast.success("Data profil desa berhasil dihapus.");
          } catch (error) { this.toast.error("Gagal menghapus data profil desa."); }
        }
      });
    },
    openAddRwModal(dusun) {
      this.rwBeingEdited = null; this.dusunForRw = dusun; this.isRwModalVisible = true;
    },
    openEditRwModal(rw, dusun) {
      this.rwBeingEdited = rw; this.dusunForRw = dusun; this.isRwModalVisible = true;
    },
    closeRwModal() {
      this.isRwModalVisible = false; this.rwBeingEdited = null; this.dusunForRw = null;
    },
    handleRwSaveSuccessful() {
      const id_dusun = this.dusunForRw.iddusun; this.closeRwModal();
      delete this.subData.rw[id_dusun]; this.fetchRwForDusun(id_dusun);
    },
    advancedDeleteRwAlert(rw, dusun) {
      this.$swal({
        title: `Hapus ${rw.namarw}?`,
        text: "Data RT yang terkait juga akan terhapus. Aksi ini tidak dapat dibatalkan.",
        icon: "warning", showCancelButton: true, confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33", cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
        cancelButtonColor: "#efefef", reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteRw(rw.idrw); this.toast.success("Data RW berhasil dihapus.");
            delete this.subData.rw[dusun.iddusun]; this.fetchRwForDusun(dusun.iddusun);
          } catch (error) { this.toast.error("Gagal menghapus data RW."); }
        }
      });
    },
    openAddRtModal(rw) {
      this.rtBeingEdited = null; this.rwForRt = rw; this.isRtModalVisible = true;
    },
    openEditRtModal(rt, rw) {
      this.rtBeingEdited = rt; this.rwForRt = rw; this.isRtModalVisible = true;
    },
    closeRtModal() {
      this.isRtModalVisible = false; this.rtBeingEdited = null; this.rwForRt = null;
    },
    handleRtSaveSuccessful() {
      const id_rw = this.rwForRt.idrw; this.closeRtModal();
      delete this.subData.rt[id_rw]; this.fetchRtForRw(id_rw);
    },
    advancedDeleteRtAlert(rt, rw) {
      this.$swal({
        title: `Hapus ${rt.namart}?`, text: "Aksi ini tidak dapat dibatalkan.",
        icon: "warning", showCancelButton: true, confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33", cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
        cancelButtonColor: "#efefef", reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteRt(rt.idrt); this.toast.success("Data RT berhasil dihapus");
            delete this.subData.rt[rw.idrw]; this.fetchRtForRw(rw.idrw);
          } catch (error) { this.toast.error("Gagal menghapus data RT"); }
        }
      });
    },
    toggleFilterVisibility() { this.isFilterVisible = !this.isFilterVisible; },
    applyFilters() {
      this.currentPage = 1; this.fetchProfiles();
    },
    resetFilters() {
      this.filters.namawilayah = ""; this.filters.alamatkantor = "";
      this.sortColumn = "created_at"; this.sortDirection = "asc";
      this.currentPage = 1; this.fetchProfiles();
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
.accordion-button:not(.collapsed) {
    color: #0d6efd;
    background-color: #e7f1ff;
}
.accordion-button:focus {
    box-shadow: none;
    border-color: rgba(0,0,0,.125);
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

.logo-placeholder {
  width: 32px;
  height: 32px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
</style>