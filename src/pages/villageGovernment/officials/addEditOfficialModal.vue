<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Perangkat Desa' : 'Tambah Data Perangkat Desa' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Desa</label>
              <select class="form-select" v-model="selectedDesaId" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Desa' }}
                </option>
                <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                  {{ desa.wilayah.namawilayah }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Periode Jabatan</label>
              <select class="form-select" v-model="formData.idperiode" required :disabled="isListLoading || !selectedDesaId">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : !selectedDesaId ? 'Pilih Desa terlebih dahulu' : 'Pilih Periode Jabatan' }}
                </option>
                <option v-for="periode in filteredPeriodeList" :key="periode.idperiode" :value="periode.idperiode">
                  {{ periode.tahunawal }} - {{ periode.tahunakhir }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Nama Pengurus</label>
              <select class="form-select" v-model="formData.idpenduduk" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Nama Pengurus' }}
                </option>
                <option v-for="penduduk in pendudukList" :key="penduduk.idpenduduk" :value="penduduk.idpenduduk">
                  {{ penduduk.nama }}
                </option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Jabatan</label>
              <select class="form-select" v-model="formData.idjabatan" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Jabatan' }}
                </option>
                <option v-for="jabatan in jabatanList" :key="jabatan.idjabatan" :value="jabatan.idjabatan">
                  {{ jabatan.namajabatan }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="formData.idstatus" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Status Perangkat Desa' }}
                </option>
                <option v-for="status in statusList" :key="status.idstatus" :value="status.idstatus">
                  {{ status.namastatus }}
                </option>
              </select>
            </div>
            
            <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="closeModal">Batal</button>
          <button type="button" class="btn btn-primary" @click="submitForm" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
            <span v-else>Simpan</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getResidents } from '@/services/general/population/residents';
import { addOfficial, updateOfficial } from '@/services/general/villageGovernment/officials'; 
import { getPeriods } from '@/services/general/villageGovernment/tenurePeriods';
import { getProfiles } from '@/services/general/villageInformation/profile';
import { getOfficialStatuses } from '@/services/referensi/officialStatuses';
import { getPositions } from '@/services/referensi/positions';
import { useToast } from "vue-toastification";

const initialFormData = {
  idperiode: '',
  idjabatan: '',
  idstatus: '',
  idpenduduk: '',
};

export default {
  name: 'addEditOfficialModal',
  props: {
    officialToEdit: { type: Object, default: null }
  },
  data() {
    return {
      formData: { ...initialFormData },
      desaList: [], 
      selectedDesaId: '', 
      periodeList: [],
      jabatanList: [],
      pendudukList: [],
      statusList: [], 
      isListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.officialToEdit;
    },
    filteredPeriodeList() {
      if (!this.selectedDesaId) {
        return [];
      }
      return this.periodeList.filter(periode => periode.iddesa == this.selectedDesaId);
    }
  },
  watch: {
    selectedDesaId(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.isEditMode && oldVal === '') return;
        this.formData.idperiode = '';
      }
    },
    officialToEdit() {
      this.populateForm();
    }
  },
  async created() {
    await this.initializeComponent();
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleOverlayClick(e) {
      if (e.target === e.currentTarget)
        this.closeModal();
    },
    
    async initializeComponent() {
      await this.fetchDropdownData(); 
      this.populateForm();           
    },

    async fetchDropdownData() {
      this.isListLoading = true;
      try {
        const [
          desaRes,
          periodeRes,
          pendudukRes,
          jabatanRes,
          statusRes
        ] = await Promise.all([
          getProfiles({ limit: -1 }),
          getPeriods({ limit: -1 }),
          getResidents({ limit: -1 }),
          getPositions({ limit: -1 }),
          getOfficialStatuses({ limit: -1 })
        ]);

        this.desaList = desaRes.data?.data || desaRes.data?.[0]?.data || [];
        this.periodeList = periodeRes.data?.data || periodeRes.data?.[0]?.data || [];
        this.pendudukList = pendudukRes.data?.data || pendudukRes.data?.[0]?.data || [];
        this.jabatanList = jabatanRes.data?.data || jabatanRes.data?.[0]?.data || [];
        this.statusList = statusRes.data?.data || statusRes.data?.[0]?.data || [];
        
      } catch (error) {
        this.toast.error("Gagal memuat semua data referensi");
      } finally {
        this.isListLoading = false;
      }
    },

    populateForm() {
      this.errorMessage = null;
      if (this.isEditMode && this.officialToEdit) {
        const data = this.officialToEdit;
        this.formData.idjabatan = data.idjabatan;
        this.formData.idperiode = data.idperiode;
        this.formData.idpenduduk = data.idpenduduk;
        this.formData.idstatus = data.idstatus;

        const selectedPeriod = this.periodeList.find(p => p.idperiode == this.formData.idperiode);
        if (selectedPeriod) {
          this.selectedDesaId = selectedPeriod.iddesa;
        }

      } else {
        this.formData = { ...initialFormData };
        this.selectedDesaId = ''; 
      }
    },
    
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;

      const data = new FormData();
      data.append('record[idpenduduk]', this.formData.idpenduduk);
      data.append('record[idjabatan]', this.formData.idjabatan);
      data.append('record[idperiode]', this.formData.idperiode);
      data.append('record[idstatus]', this.formData.idstatus);

      try {
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          await updateOfficial(this.officialToEdit.idperangkat, data);
          this.toast.success("Data perangkat desa berhasil diperbarui");
        } else {
          await addOfficial(data);
          this.toast.success("Data perangkat desa berhasil ditambah");
        }
        this.$emit('save-successful');
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data perangkat desa");
      } finally {
        this.isLoading = false;
      }
    }
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050;
}
.modal-content {
  background: white; border-radius: 8px; width: 90%; max-width: 700px;
  max-height: 90vh; box-shadow: 0 5px 15px rgba(0,0,0,.5);
  display: flex; flex-direction: column;
}
.modal-header, .modal-footer {
  padding: 1rem; flex-shrink: 0;
}
.modal-body {
  padding: 1rem; overflow-y: auto; flex-grow: 1;
}
.modal-header { 
  border-bottom: 1px solid #dee2e6; display: flex; 
  justify-content: space-between; align-items: center; 
}
.modal-footer { 
  border-top: 1px solid #dee2e6; display: flex; 
  justify-content: flex-end; gap: 0.5rem; 
}
.text-danger { 
  color: #dc3545 !important; 
}
</style>