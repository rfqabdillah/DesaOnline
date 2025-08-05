<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">
          {{ isEditMode ? "Edit Data RT" : "Tambah Data RT" }}
        </h5>
        <button type="button" class="btn-close" @click="closeModal"></button>
      </div>
      <div class="modal-body">
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="namarw" class="form-label">Nama RW</label>
            <input
              type="text"
              id="namarw"
              class="form-control"
              :value="rwData?.namarw"
              disabled
              readonly
            />
          </div>

          <div class="mb-3">
            <label for="namart" class="form-label">Nama RT</label>
            <input
              type="text"
              id="namart"
              class="form-control"
              v-model="formData.namart"
              placeholder="Contoh: RT 001"
              required
            />
          </div>

          <div class="mb-3">
            <label for="idpenduduk" class="form-label">Nama Ketua RT</label>
            <select
              id="idpenduduk"
              class="form-select"
              v-model="formData.idpenduduk"
              :disabled="isLoading"
            >
              <option disabled value="">
                {{ filteredResidents.length > 0 ? 'Pilih Ketua RT' : 'Tidak ada penduduk di RT ini' }}
              </option>
              <option
                v-for="resident in filteredResidents"
                :key="resident.idpenduduk"
                :value="resident.idpenduduk"
              >
                {{ resident.nama }} 
              </option>
            </select>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">
          Batal
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="submitForm"
          :disabled="isLoading"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
          ></span>
          <span v-else>Simpan</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { addRt, updateRt } from "@/services/general/villageInformation/rt";
import { getResidents } from "@/services/general/population/residents";
import { useToast } from "vue-toastification";

const initialFormData = {
  namart: "",
  idpenduduk: "",
  idrw: null,
};

export default {
  name: "AddEditRtModal",
  props: {
    rtToEdit: { type: Object, default: null },
    rwData: { type: Object, required: true },
  },
  data() {
    return {
      formData: { ...initialFormData },
      residents: [],
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.rtToEdit;
    },
    // Filter residents based on the parent RW's ID
    filteredResidents() {
      if (!this.rwData || !this.rwData.idrw) {
        return [];
      }
      return this.residents.filter(resident => {
        // Filter by checking if the resident's rt object has a matching idrw.
        return resident.rt && resident.rt.idrw === this.rwData.idrw;
      });
    }
  },
  watch: {
    rtToEdit: {
      handler(newData) {
        if (newData) {
          this.formData.namart = newData.namart;
          this.formData.idpenduduk = newData.idpenduduk;
        } else {
          this.formData = { ...initialFormData };
        }

        if (this.rwData) {
          this.formData.idrw = this.rwData.idrw;
        }

        this.errorMessage = null;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.fetchResidents();
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    handleOverlayClick(e) {
      if (e.target === e.currentTarget) this.closeModal();
    },
    async fetchResidents() {
      this.isLoading = true;
      try {
        const response = await getResidents({ limit: -1 });
        this.residents = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar penduduk.");
      } finally {
        this.isLoading = false;
      }
    },
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;

      const data = new FormData();
      data.append("record[idrw]", this.formData.idrw);
      data.append("record[namart]", this.formData.namart);
      data.append("record[idpenduduk]", this.formData.idpenduduk);

      try {
        if (this.isEditMode) {
          data.append("_method", "PUT");
          await updateRt(this.rtToEdit.idrt, data);
          this.toast.success("Data RT berhasil diperbarui");
        } else {
          await addRt(data);
          this.toast.success("Data RT berhasil ditambah");
        }
        this.$emit("save-successful");
        this.closeModal();
      } catch (error) {
        this.errorMessage =
          error.response?.data?.failed ||
          error.response?.data?.message ||
          "Gagal menyimpan data. Silakan coba lagi.";
        this.toast.error("Gagal menyimpan data RT");
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1055;
}
.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-header,
.modal-footer,
.modal-body {
  padding: 1rem;
}
.modal-header {
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-body {
  overflow-y: auto;
}
.modal-footer { 
  border-top: 1px solid #dee2e6; display: flex; 
  justify-content: flex-end; gap: 0.5rem; 
}
</style>
