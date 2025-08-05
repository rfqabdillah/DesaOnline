<template>
  <div class="col-sm-12">
    <add-edit-profile-modal
      v-if="isProfileModalVisible"
      :profile-to-edit="profileBeingEdited"
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
      <div class="card-header">
        <h3>Daftar Desa</h3>
      </div>
      <div class="card-body">
        <div class="d-flex justify-content-end align-items-start mb-3">
          <div class="d-flex gap-2">
            <button
              class="btn btn-outline-light txt-dark"
              @click="toggleFilterVisibility"
            >
              <i
                :class="isFilterVisible ? 'fa fa-angle-up' : 'fa fa-angle-down'"
                class="me-2"
              ></i>
              <span
                >{{
                  isFilterVisible ? "Sembunyikan" : "Tampilkan"
                }}
                Filter</span
              >
            </button>
            <button class="btn btn-success" @click="openAddProfileModal">
              <i class="fa fa-plus me-2"></i>
              <span>Tambah Data Desa</span>
            </button>
          </div>
        </div>

        <div
          v-if="isFilterVisible"
          class="border p-3 mb-3 rounded filter-section"
        >
          <div class="row g-3">
            <div class="col-md-4">
              <label for="filterName" class="form-label">Nama Desa</label>
              <input
                type="text"
                id="filterName"
                class="form-control"
                v-model="filters.namawilayah"
                placeholder="Filter berdasarkan nama desa"
              />
            </div>
            <div class="col-md-4">
              <label for="filterAddress" class="form-label"
                >Alamat Kantor</label
              >
              <input
                type="text"
                id="filterAddress"
                class="form-control"
                v-model="filters.alamatkantor"
                placeholder="Filter berdasarkan alamat kantor"
              />
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

      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" style="width: 5%">No</th>
              <th scope="col" style="width: 10%">Logo</th>
              <th scope="col" @click="sortBy('namawilayah')">
                Nama Desa
                <i
                  class="fa fa-sort-asc"
                  v-if="sortColumn === 'namawilayah' && sortDirection === 'asc'"
                ></i>
                <i
                  class="fa fa-sort-desc"
                  v-else-if="
                    sortColumn === 'namawilayah' && sortDirection === 'desc'
                  "
                ></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" @click="sortBy('alamatkantor')">
                Alamat Kantor
                <i
                  class="fa fa-sort-asc"
                  v-if="
                    sortColumn === 'alamatkantor' && sortDirection === 'asc'
                  "
                ></i>
                <i
                  class="fa fa-sort-desc"
                  v-else-if="
                    sortColumn === 'alamatkantor' && sortDirection === 'desc'
                  "
                ></i>
                <i class="fa fa-sort" v-else></i>
              </th>
              <th scope="col" style="width: 20%">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="text-center p-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Memuat data...</p>
              </td>
            </tr>
            <template v-else-if="paginatedProfiles.length > 0">
              <template
                v-for="(profile, index) in paginatedProfiles"
                :key="profile.iddesa"
              >
                <tr>
                  <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                  <td>
                    <img
                      :src="profile.logo"
                      alt="Logo"
                      style="height: 40px; width: auto"
                      v-if="profile.logo"
                    />
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <button class="btn btn-expand flex-shrink-0" @click="toggleExpand(profile, 'desa')">
                        <i class="fa fa-chevron-right" :class="{ 'is-expanded': expanded.desa[profile.iddesa] }"></i>
                      </button>
                      <span class="fw-bold">{{
                        profile.wilayah.namawilayah
                      }}</span>
                    </div>
                  </td>
                  <td>{{ profile.alamatkantor || "-" }}</td>
                  <td>
                    <div class="btn-group">
                      <button
                        class="btn btn-info btn-sm"
                        @click="openDetailModal(profile)"
                      >
                        <i class="fa fa-eye"></i>
                      </button>
                      <button
                        class="btn btn-primary btn-sm"
                        @click="openEditProfileModal(profile)"
                      >
                        <i class="fa fa-pencil"></i>
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        @click="advancedDeleteAlert(profile.iddesa)"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="expanded.desa[profile.iddesa]" class="nested-row">
                  <td :colspan="5" class="nested-content-cell">
                    <div
                      v-if="loading.dusun[profile.iddesa]"
                      class="text-center p-3"
                    >
                      <div class="spinner-border spinner-border-sm"></div>
                      Memuat Dusun...
                    </div>
                    <div
                      v-else-if="
                        !subData.dusun[profile.iddesa] ||
                        subData.dusun[profile.iddesa].length === 0
                      "
                      class="p-3 text-center"
                    >
                      <p class="text-muted fst-italic mb-2">
                        Belum ada data dusun.
                      </p>
                      <button
                        class="btn btn-success btn-sm"
                        @click="openAddDusunModal(profile)"
                      >
                        <i class="fa fa-plus"></i> Tambah Dusun Pertama
                      </button>
                    </div>
                    <div v-else>
                      <ul class="list-group list-group-flush">
                        <li
                          v-for="dusun in subData.dusun[profile.iddesa]"
                          :key="dusun.iddusun"
                          class="list-group-item px-0 py-2"
                        >
                          <div
                            class="d-flex justify-content-between align-items-center"
                          >
                            <div class="d-flex align-items-center gap-2">
                              <button
                                class="btn btn-light btn-expand me-2"
                                @click="toggleExpand(dusun, 'dusun')"
                              >
                                <i class="fa fa-chevron-right" :class="{ 'is-expanded': expanded.dusun[dusun.iddusun] }"></i>
                              </button>
                              <span
                                >{{ dusun.namadusun }}
                                <span class="badge bg-secondary ms-1"
                                  >Dusun</span
                                ></span
                              >
                            </div>
                            <div class="btn-group" role="group">
                              <button
                                class="btn btn-success btn-xs"
                                title="Tambah RW"
                                @click="openAddRwModal(dusun)"
                              >
                                <i class="fa fa-plus"></i> RW
                              </button>
                              <button
                                class="btn btn-primary btn-xs"
                                title="Edit Dusun"
                                @click="openEditDusunModal(dusun, profile)"
                              >
                                <i class="fa fa-pencil"></i>
                              </button>
                              <button
                                class="btn btn-danger btn-xs"
                                title="Hapus Dusun"
                                @click="
                                  advancedDeleteDusunAlert(dusun, profile)
                                "
                              >
                                <i class="fa fa-trash"></i>
                              </button>
                            </div>
                          </div>

                          <div
                            v-if="expanded.dusun[dusun.iddusun]"
                            class="nested-list ps-5 pt-2"
                          >
                            <div
                              v-if="loading.rw[dusun.iddusun]"
                              class="text-center p-2"
                            >
                              <div
                                class="spinner-border spinner-border-sm text-secondary"
                              ></div>
                              Memuat RW...
                            </div>
                            <div
                              v-else-if="
                                !subData.rw[dusun.iddusun] ||
                                subData.rw[dusun.iddusun].length === 0
                              "
                              class="text-muted fst-italic p-2"
                            >
                              Belum ada data RW di dusun ini.
                            </div>
                            <ul v-else class="list-group list-group-flush">
                              <li
                                v-for="rw in subData.rw[dusun.iddusun]"
                                :key="rw.idrw"
                                class="list-group-item px-0 py-2"
                              >
                                <div
                                  class="d-flex justify-content-between align-items-center"
                                >
                                  <div class="d-flex align-items-center gap-2">
                                    <button
                                      class="btn btn-light btn-expand me-2"
                                      @click="toggleExpand(rw, 'rw')"
                                    >
                                      <i class="fa fa-chevron-right" :class="{ 'is-expanded': expanded.rw[rw.idrw] }"></i>
                                    </button>
                                    <span
                                      >{{ rw.namarw }}
                                      <span class="badge bg-info ms-1"
                                        >RW</span
                                      ></span
                                    >
                                  </div>
                                  <div class="btn-group" role="group">
                                    <button
                                      class="btn btn-success btn-xs"
                                      title="Tambah RT"
                                      @click="openAddRtModal(rw)"
                                    >
                                      <i class="fa fa-plus"></i> RT
                                    </button>
                                    <button
                                      class="btn btn-primary btn-xs"
                                      title="Edit RW"
                                      @click="openEditRwModal(rw, dusun)"
                                    >
                                      <i class="fa fa-pencil"></i>
                                    </button>
                                    <button
                                      class="btn btn-danger btn-xs"
                                      title="Hapus RW"
                                      @click="advancedDeleteRwAlert(rw, dusun)"
                                    >
                                      <i class="fa fa-trash"></i>
                                    </button>
                                  </div>
                                </div>

                                <div
                                  v-if="expanded.rw[rw.idrw]"
                                  class="nested-list ps-5 pt-2"
                                >
                                  <div
                                    v-if="loading.rt[rw.idrw]"
                                    class="text-center p-2"
                                  >
                                    <div
                                      class="spinner-border spinner-border-sm text-success"
                                    ></div>
                                    Memuat RT...
                                  </div>
                                  <div
                                    v-else-if="
                                      !subData.rt[rw.idrw] ||
                                      subData.rt[rw.idrw].length === 0
                                    "
                                    class="text-muted fst-italic p-2"
                                  >
                                    Belum ada data RT di RW ini.
                                  </div>
                                  <ul
                                    v-else
                                    class="list-group list-group-flush"
                                  >
                                    <li
                                      v-for="rt in subData.rt[rw.idrw]"
                                      :key="rt.idrt"
                                      class="list-group-item px-0 py-2"
                                    >
                                      <div
                                        class="d-flex justify-content-between align-items-center"
                                      >
                                        <div
                                          class="d-flex align-items-center ps-4"
                                        >
                                          <span
                                            >{{ rt.namart }}
                                            <span class="badge bg-success ms-1"
                                              >RT</span
                                            ></span
                                          >
                                        </div>
                                        <div class="btn-group" role="group">
                                          <button
                                            class="btn btn-primary btn-xs"
                                            title="Edit RT"
                                            @click="openEditRtModal(rt, rw)"
                                          >
                                            <i class="fa fa-pencil"></i>
                                          </button>
                                          <button
                                            class="btn btn-danger btn-xs"
                                            title="Hapus RT"
                                            @click="
                                              advancedDeleteRtAlert(rt, rw)
                                            "
                                          >
                                            <i class="fa fa-trash"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                      <div class="mt-3 text-end">
                        <button
                          class="btn btn-outline-success btn-sm"
                          @click="openAddDusunModal(profile)">
                          <i class="fa fa-plus"></i> Tambah Dusun Baru
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </template>
            <tr v-else>
              <td colspan="5" class="text-center">
                Tidak ada data yang tersedia.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="d-flex flex-column flex-md-row justify-content-md-between align-items-center mt-3 px-3 pb-3"
      >
        <div class="mt-2">
          <span v-if="totalItems > 0" class="text-muted">
            Menampilkan <strong>{{ (currentPage - 1) * perPage + 1 }}</strong> -
            <strong>{{ Math.min(currentPage * perPage, totalItems) }}</strong>
            dari <strong>{{ totalItems }}</strong> data
          </span>
        </div>
        <nav
          v-if="perPage !== -1 && totalPages > 1"
          class="d-flex align-items-center flex-wrap gap-2 mt-2"
        >
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">
                Prev
              </button>
            </li>
            <li
              class="page-item"
              v-for="page in pageNumbers"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="changePage(page)">
                {{ page }}
              </button>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <button class="page-link" @click="changePage(currentPage + 1)">
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
// Import services
import {getProfiles, deleteProfile,} from "@/services/general/villageInformation/profile";
import {getDusuns, deleteDusun,} from "@/services/general/villageInformation/dusun";
import { getRw, deleteRw } from "@/services/general/villageInformation/rw";
import { getRt, deleteRt } from "@/services/general/villageInformation/rt";

// Import Modals
import AddEditProfileModal from "./addEditProfileModal.vue";
import DetailProfileModal from "./detailProfile.vue";
import AddEditDusunModal from "./addEditDusunModal.vue";
import AddEditRwModal from "./addEditRwModal.vue";
import AddEditRtModal from "./addEditRtModal.vue";

import { useToast } from "vue-toastification";

export default {
  components: {
    AddEditProfileModal,
    DetailProfileModal,
    AddEditDusunModal,
    AddEditRwModal,
    AddEditRtModal,
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

      // Modal visibility states
      isProfileModalVisible: false,
      isDetailModalVisible: false,
      isDusunModalVisible: false,
      isRwModalVisible: false,
      isRtModalVisible: false,

      // Data for modals
      profileBeingEdited: null,
      profileBeingViewed: null,
      profileForDusun: null,
      dusunBeingEdited: null,
      dusunForRw: null,
      rwBeingEdited: null,
      rwForRt: null,
      rtBeingEdited: null,

      // State untuk expand
      expanded: {
        desa: {},
        dusun: {},
        rw: {},
      },
      loading: {
        dusun: {},
        rw: {},
        rt: {},
      },
      subData: {
        dusun: {},
        rw: {},
        rt: {},
      },
      isFilterVisible: false,
      filters: {
        namawilayah: "",
        alamatkantor: "",
      },
    };
  },
  computed: {
    paginatedProfiles() {
      return this.profiles;
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
      this.fetchProfiles();
    },
    perPage() {
      this.currentPage = 1;
      this.fetchProfiles();
    },
  },
  async mounted() {
    this.toast = useToast();
    await this.fetchProfiles();
  },
  methods: {
    async fetchProfiles() {
      this.isLoading = true;
      try {
        const params = {
          page: this.currentPage,
          limit: this.perPage,
          order: this.sortColumn
            ? `${this.sortColumn} ${this.sortDirection}`
            : "",
          filter: this.filters.namawilayah
            ? `namawilayah=${this.filters.namawilayah}`
            : "", 
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
        const response = await getDusuns({
          filter: `iddesa=${id_desa}`,
          limit: -1,
        });
        this.subData.dusun[id_desa] =
          response.data?.data || response.data?.[0]?.data || [];
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
        const response = await getRw({
          filter: `iddusun=${id_dusun}`,
          limit: -1,
        });
        this.subData.rw[id_dusun] =
          response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error(`Gagal memuat data RW.`);
        this.subData.rw[id_dusun] = [];
      } finally {
        this.loading.rw[id_dusun] = false;
      }
    },
    toggleExpand(item, level) {
      const id = item[`id${level}`];
      this.expanded[level][id] = !this.expanded[level][id];
      if (level === "desa" && this.expanded.desa[id]) {
        this.fetchDusunForDesa(id);
      }
      if (level === "dusun" && this.expanded.dusun[id]) {
        this.fetchRwForDusun(id);
      }
      if (level === "rw" && this.expanded.rw[id]) {
        this.fetchRtForRw(id);
      }
    },
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortDirection = "asc";
      }
      this.fetchProfiles();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    // --- Dusun Methods ---
    openAddDusunModal(profile) {
      this.dusunBeingEdited = null;
      this.profileForDusun = profile;
      this.isDusunModalVisible = true;
    },
    openEditDusunModal(dusun, profile) {
      this.dusunBeingEdited = dusun;
      this.profileForDusun = profile;
      this.isDusunModalVisible = true;
    },
    closeDusunModal() {
      this.isDusunModalVisible = false;
      this.dusunBeingEdited = null;
      this.profileForDusun = null;
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
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33",
        cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
        cancelButtonColor: "#efefef",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteDusun(dusun.iddusun);
            this.toast.success("Data dusun berhasil dihapus.");
            // Refresh list
            delete this.subData.dusun[profile.iddesa];
            this.fetchDusunForDesa(profile.iddesa);
          } catch (error) {
            this.toast.error("Gagal menghapus data dusun.");
          }
        }
      });
    },

    // --- Profile/Desa Methods ---
    openAddProfileModal() {
      this.profileBeingEdited = null;
      this.isProfileModalVisible = true;
    },
    openEditProfileModal(item) {
      this.profileBeingEdited = item;
      this.isProfileModalVisible = true;
    },
    closeProfileModal() {
      this.isProfileModalVisible = false;
    },
    handleProfileSaveSuccessful() {
      this.closeProfileModal();
      this.fetchProfiles();
    },
    openDetailModal(item) {
      this.profileBeingViewed = { ...item };
      this.isDetailModalVisible = true;
    },
    closeDetailModal() {
      this.isDetailModalVisible = false;
    },
    advancedDeleteAlert(id) {
      this.$swal({
        title: "Hapus Data Profil Desa",
        text: "Apakah Anda yakin ingin menghapus data ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33",
        cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
        cancelButtonColor: "#efefef",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteProfile(id);
            this.fetchProfiles();
            this.toast.success("Data profil desa berhasil dihapus.");
          } catch (error) {
            this.toast.error("Gagal menghapus data profil desa.");
          }
        }
      });
    },

    // --- RW Methods ---
    openAddRwModal(dusun) {
      this.rwBeingEdited = null;
      this.dusunForRw = dusun;
      this.isRwModalVisible = true;
    },

    openEditRwModal(rw, dusun) {
      this.rwBeingEdited = rw;
      this.dusunForRw = dusun;
      this.isRwModalVisible = true;
    },

    closeRwModal() {
      this.isRwModalVisible = false;
      this.rwBeingEdited = null;
      this.dusunForRw = null;
    },

    handleRwSaveSuccessful() {
      const id_dusun = this.dusunForRw.iddusun;
      this.closeRwModal();
      delete this.subData.rw[id_dusun];
      this.fetchRwForDusun(id_dusun);
    },

    advancedDeleteRwAlert(rw, dusun) {
      this.$swal({
        title: `Hapus ${rw.namarw}?`,
        text: "Data RT yang terkait juga akan terhapus. Aksi ini tidak dapat dibatalkan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33",
        cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
        cancelButtonColor: "#efefef",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteRw(rw.idrw);
            this.toast.success("Data RW berhasil dihapus.");
            // Refresh list
            delete this.subData.rw[dusun.iddusun];
            this.fetchRwForDusun(dusun.iddusun);
          } catch (error) {
            this.toast.error("Gagal menghapus data RW.");
          }
        }
      });
    },

    // --- RT Methods ---
    openAddRtModal(rw) {
      this.rtBeingEdited = null;
      this.rwForRt = rw;
      this.isRtModalVisible = true;
    },

    openEditRtModal(rt, rw) {
      this.rtBeingEdited = rt;
      this.rwForRt = rw;
      this.isRtModalVisible = true;
    },

    closeRtModal() {
      this.isRtModalVisible = false;
      this.rtBeingEdited = null;
      this.rwForRt = null;
    },

    handleRtSaveSuccessful() {
      const id_rw = this.rwForRt.idrw;
      this.closeRtModal();
      // Hapus cache data RT agar di-fetch ulang
      delete this.subData.rt[id_rw];
      this.fetchRtForRw(id_rw);
    },

    async fetchRtForRw(id_rw) {
      // Jangan fetch ulang jika data sudah ada
      if (this.subData.rt[id_rw]) return;

      this.loading.rt[id_rw] = true;
      try {
        const response = await getRt({ filter: `idrw=${id_rw}`, limit: -1 });
        this.subData.rt[id_rw] =
          response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error(`Gagal memuat data RT.`);
        this.subData.rt[id_rw] = [];
      } finally {
        this.loading.rt[id_rw] = false;
      }
    },

    advancedDeleteRtAlert(rt, rw) {
      this.$swal({
        title: `Hapus ${rt.namart}?`,
        text: "Aksi ini tidak dapat dibatalkan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus!',
        confirmButtonColor: "#d33",
        cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
        cancelButtonColor: "#efefef",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteRt(rt.idrt);
            this.toast.success("Data RT berhasil dihapus");
            // Refresh list
            delete this.subData.rt[rw.idrw];
            this.fetchRtForRw(rw.idrw);
          } catch (error) {
            this.toast.error("Gagal menghapus data RT");
          }
        }
      });
    },

    // --- Filter Methods ---
    toggleFilterVisibility() {
      this.isFilterVisible = !this.isFilterVisible;
    },
    applyFilters() {
      this.currentPage = 1;
      this.fetchProfiles();
    },
    resetFilters() {
      this.filters.namawilayah = "";
      this.filters.alamatkantor = "";
      this.sortColumn = "created_at";
      this.sortDirection = "asc";
      this.currentPage = 1;
      this.fetchProfiles();
    },
  },
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.nested-row > td {
  border-top: 0 !important;
}

.nested-content-cell {
  padding: 0.5rem 1rem 1rem 3rem !important;
  background-color: #f8f9fa;
  box-shadow: inset 3px 0px 5px -2px rgba(0, 0, 0, 0.05);
}

.nested-list {
  margin-left: 1rem;
  padding-left: 1rem;
}

.list-group-item {
  border: 0;
  background-color: transparent; 
}
.btn-xs {
  --bs-btn-padding-y: 0.1rem;
  --bs-btn-padding-x: 0.5rem;
  --bs-btn-font-size: 0.75rem;
}

.btn-expand {
  /* DIUBAH: Tambahkan !important untuk memaksa background menjadi transparan */
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

.btn-expand:hover {
  background-color: #e9ecef !important; /* Pastikan hover juga dipaksa */
}

.btn-expand:focus, .btn-expand:active {
  outline: none !important;
  box-shadow: none !important;
}

.btn-expand i {
  margin: 0;
  padding: 0;
  line-height: 1; 
  transition: transform 0.2s ease-in-out;
}

.btn-expand i.is-expanded {
  transform: rotate(90deg);
}

</style>
