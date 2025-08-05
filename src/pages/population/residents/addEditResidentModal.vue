<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data Penduduk' : 'Tambah Data Penduduk' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">

            <div class="mb-3">
              <label class="form-label">Nomor Induk Kependudukan (NIK)</label>
              <input type="text" class="form-control" v-model="formData.nik" placeholder="Masukkan NIK" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Nama</label>
              <input type="text" class="form-control" v-model="formData.nama" placeholder="Masukkan nama" required />
            </div>

            <!-- CASCADING SELECTS FOR UI FILTERING -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Desa</label>
                <select class="form-select" v-model="selectedLocation.desa" required :disabled="isListLoading">
                  <option disabled value="">
                    {{ isListLoading ? 'Memuat...' : 'Pilih Desa' }}
                  </option>
                  <option v-for="desa in desaList" :key="desa.iddesa" :value="desa.iddesa">
                    {{ desa.wilayah?.namawilayah }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Dusun</label>
                <select class="form-select" v-model="selectedLocation.dusun" required :disabled="isListLoading || !selectedLocation.desa">
                  <option disabled value="">
                    {{ !selectedLocation.desa ? 'Pilih Desa terlebih dahulu' : (isListLoading ? 'Memuat...' : 'Pilih Dusun') }}
                  </option>
                  <option v-for="dusun in filteredDusunList" :key="dusun.iddusun" :value="dusun.iddusun">
                    {{ dusun.namadusun }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama RW</label>
                <select class="form-select" v-model="selectedLocation.rw" required :disabled="isListLoading || !selectedLocation.dusun">
                  <option disabled value="">
                    {{ !selectedLocation.dusun ? 'Pilih Dusun terlebih dahulu' : (isListLoading ? 'Memuat...' : 'Pilih RW') }}
                  </option>
                  <option v-for="rw in filteredRwList" :key="rw.idrw" :value="rw.idrw">
                    {{ rw.namarw }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama RT</label>
                <!-- This is the only location ID that will be saved -->
                <select class="form-select" v-model="formData.idrt" required :disabled="isListLoading || !selectedLocation.rw">
                  <option disabled value="">
                    {{ !selectedLocation.rw ? 'Pilih RW terlebih dahulu' : (isListLoading ? 'Memuat...' : 'Pilih RT') }}
                  </option>
                  <option v-for="rt in filteredRtList" :key="rt.idrt" :value="rt.idrt">
                    {{ rt.namart }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Tempat Lahir</label>
                <input type="text" class="form-control" v-model="formData.tempatlahir" placeholder="Tempat Lahir..." required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Tanggal Lahir</label>
                <input type="date" class="form-control" v-model="formData.tanggallahir" required />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Agama</label>
                <select class="form-select" v-model="formData.idagama" required :disabled="isListLoading">
                  <option disabled value="">{{ isListLoading ? 'Memuat...' : 'Pilih Agama' }}</option>
                  <option v-for="religion in religionsList" :key="religion.idagama" :value="religion.idagama">
                    {{ religion.namaagama }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Golongan Darah</label>
                <select class="form-select" v-model="formData.idgolongandarah" required :disabled="isListLoading">
                  <option disabled value="">{{ isListLoading ? 'Memuat...' : 'Pilih Golongan Darah' }}</option>
                  <option v-for="bloodTypes in bloodTypesList" :key="bloodTypes.idgolongandarah" :value="bloodTypes.idgolongandarah">
                    {{ bloodTypes.namagolongandarah }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Jenis Kelamin</label>
              <select class="form-select" v-model="formData.idjeniskelamin" required :disabled="isListLoading">
                <option disabled value="">{{ isListLoading ? 'Memuat...' : 'Pilih Jenis Kelamin' }}</option>
                <option v-for="gender in genderList" :key="gender.idjeniskelamin" :value="gender.idjeniskelamin">
                  {{ gender.namajeniskelamin }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Hubungan Keluarga</label>
              <select class="form-select" v-model="formData.idhubungankeluarga" required :disabled="isListLoading">
                <option disabled value="">{{ isListLoading ? 'Memuat...' : 'Pilih Hubungan Keluarga' }}</option>
                <option v-for="familyRelationships in familyRelationshipsList" :key="familyRelationships.idhubungankeluarga" :value="familyRelationships.idhubungankeluarga">
                  {{ familyRelationships.namahubungankeluarga }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Pekerjaan</label>
              <select class="form-select" v-model="formData.idpekerjaan" required :disabled="isListLoading">
                <option disabled value="">{{ isListLoading ? 'Memuat...' : 'Pilih Pekerjaan' }}</option>
                <option v-for="occupations in occupationsList" :key="occupations.idpekerjaan" :value="occupations.idpekerjaan">
                  {{ occupations.namapekerjaan }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Pendidikan</label>
              <select class="form-select" v-model="formData.idpendidikan" required :disabled="isListLoading">
                <option disabled value="">{{ isListLoading ? 'Memuat...' : 'Pilih Pendidikan' }}</option>
                <option v-for="educations in educationsList" :key="educations.idpendidikan" :value="educations.idpendidikan">
                  {{ educations.namapendidikan }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Status Perkawinan</label>
              <select class="form-select" v-model="formData.idstatusperkawinan" required :disabled="isListLoading">
                <option disabled value="">{{ isListLoading ? 'Memuat...' : 'Pilih Status Perkawinan' }}</option>
                <option v-for="martialStatuses in martialStatusesList" :key="martialStatuses.idstatusperkawinan" :value="martialStatuses.idstatusperkawinan">
                  {{ martialStatuses.namastatusperkawinan }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Penolong Kelahiran</label>
              <select class="form-select" v-model="formData.idpenolongkelahiran" required :disabled="isListLoading">
                <option disabled value="">{{ isListLoading ? 'Memuat...' : 'Pilih Penolong Kelahiran' }}</option>
                <option v-for="birthAttendants in birthAttendantsList" :key="birthAttendants.idpenolongkelahiran" :value="birthAttendants.idpenolongkelahiran">
                  {{ birthAttendants.namapenolongkelahiran }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Tempat Dilahirkan</label>
              <select class="form-select" v-model="formData.idtempatkelahiran" required :disabled="isListLoading">
                <option disabled value="">{{ isListLoading ? 'Memuat...' : 'Pilih Tempat Dilahirkan' }}</option>
                <option v-for="birthPlaces in birthPlacesList" :key="birthPlaces.idtempatdilahirkan" :value="birthPlaces.idtempatdilahirkan">
                  {{ birthPlaces.namatempatdilahirkan }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Nomor whatsapp</label>
              <input type="text" class="form-control" v-model="formData.whatsapp" placeholder="Masukkan Nomor Whatsapp" required />
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
import { addResident, updateResident } from '@/services/general/population/residents';
import { getGenders } from '@/services/referensi/genders';
import { getReligions } from '@/services/referensi/religions';
import { getBloodTypes } from '@/services/referensi/bloodTypes';
import { getBirthPlaces } from '@/services/referensi/birthPlaces';
import { getFamilyRelationships } from '@/services/referensi/familyRelationships';
import { getEducationLevels } from '@/services/referensi/educationLevels';
import { getOccupations } from '@/services/referensi/occupations';
import { getBirthAttendants } from '@/services/referensi/birthAttendants';
import { getMartialStatuses } from '@/services/referensi/martialStatuses';
import { useToast } from "vue-toastification";

// Imports for Cascading Selects
import { getProfiles } from "@/services/general/villageInformation/profile"; //desa  
import { getDusuns } from "@/services/general/villageInformation/dusun"; //dusun  
import { getRw } from "@/services/general/villageInformation/rw"; //rw  
import { getRt } from "@/services/general/villageInformation/rt"; //rt

const initialFormData = {
  nik: '',
  nama: '',
  tempatlahir: '',
  tanggallahir: '',
  idrt: '',
  idjeniskelamin: '',
  idagama: '',
  idgolongandarah: '',
  idhubungankeluarga: '',
  idpekerjaan: '',
  idpendidikan: '',
  idpenolongkelahiran: '',
  idstatusperkawinan: '',
  idtempatkelahiran: '',
  whatsapp: '',
};

export default {
  name: 'addEditResidentModal',
  props: {
    residentToEdit: { type: Object, default: null }
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedLocation: {
        desa: '',
        dusun: '',
        rw: '',
      },
      desaList: [],
      dusunList: [],
      rwList: [],
      rtList: [],
      genderList: [],
      religionsList: [],
      bloodTypesList: [],
      familyRelationshipsList: [],
      occupationsList: [],
      educationsList: [],
      martialStatusesList: [],
      birthAttendantsList: [],
      birthPlacesList: [],
      isListLoading: false,
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
    };
  },
  computed: {
    isEditMode() {
      return !!this.residentToEdit;
    },
    filteredDusunList() {
      if (!this.selectedLocation.desa) return [];
      return this.dusunList.filter(d => d.iddesa == this.selectedLocation.desa);
    },
    filteredRwList() {
      if (!this.selectedLocation.dusun) return [];
      return this.rwList.filter(rw => rw.iddusun == this.selectedLocation.dusun);
    },
    filteredRtList() {
      if (!this.selectedLocation.rw) return [];
      return this.rtList.filter(rt => rt.idrw == this.selectedLocation.rw);
    }
  },
  watch: {
    'selectedLocation.desa'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedLocation.dusun = '';
        this.selectedLocation.rw = '';
        this.formData.idrt = '';
      }
    },
    'selectedLocation.dusun'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedLocation.rw = '';
        this.formData.idrt = '';
      }
    },
    'selectedLocation.rw'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.formData.idrt = '';
      }
    },
    residentToEdit() {
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
          desaRes, dusunRes, rwRes, rtRes, genderRes, religionRes, bloodRes,
          familyRes, occupationRes, educationRes, birthAttendantRes, martialRes, birthPlaceRes
        ] = await Promise.all([
          getProfiles({ limit: -1 }),
          getDusuns({ limit: -1 }),
          getRw({ limit: -1 }),
          getRt({ limit: -1 }),
          getGenders({ limit: -1 }),
          getReligions({ limit: -1 }),
          getBloodTypes({ limit: -1 }),
          getFamilyRelationships({ limit: -1 }),
          getOccupations({ limit: -1 }),
          getEducationLevels({ limit: -1 }),
          getBirthAttendants({ limit: -1 }),
          getMartialStatuses({ limit: -1 }),
          getBirthPlaces({ limit: -1 }),
        ]);

        this.desaList = desaRes.data?.data || desaRes.data?.[0]?.data || [];
        this.dusunList = dusunRes.data?.data || dusunRes.data?.[0]?.data || [];
        this.rwList = rwRes.data?.data || rwRes.data?.[0]?.data || [];
        this.rtList = rtRes.data?.data || rtRes.data?.[0]?.data || [];
        this.genderList = genderRes.data?.data || genderRes.data?.[0]?.data || [];
        this.religionsList = religionRes.data?.data || religionRes.data?.[0]?.data || [];
        this.bloodTypesList = bloodRes.data?.data || bloodRes.data?.[0]?.data || [];
        this.familyRelationshipsList = familyRes.data?.data || familyRes.data?.[0]?.data || [];
        this.occupationsList = occupationRes.data?.data || occupationRes.data?.[0]?.data || [];
        this.educationsList = educationRes.data?.data || educationRes.data?.[0]?.data || [];
        this.birthAttendantsList = birthAttendantRes.data?.data || birthAttendantRes.data?.[0]?.data || [];
        this.martialStatusesList = martialRes.data?.data || martialRes.data?.[0]?.data || [];
        this.birthPlacesList = birthPlaceRes.data?.data || birthPlaceRes.data?.[0]?.data || [];

      } catch (error) {
        this.toast.error("Gagal memuat semua data referensi");
      } finally {
        this.isListLoading = false;
      }
    },

    populateForm() {
      this.errorMessage = null;
      if (this.isEditMode && this.residentToEdit) {
        // Assign all matching properties from residentToEdit to formData
        Object.assign(this.formData, this.residentToEdit);
        
        // Work backwards to populate the UI dropdowns
        const rt = this.rtList.find(r => r.idrt === this.residentToEdit.idrt);
        if (rt) {
          const rw = this.rwList.find(r => r.idrw === rt.idrw);
          if (rw) {
            const dusun = this.dusunList.find(d => d.iddusun === rw.iddusun);
            if (dusun) {
              this.selectedLocation.desa = dusun.iddesa;
              this.selectedLocation.dusun = dusun.iddusun;
              this.selectedLocation.rw = rw.idrw;
            }
          }
        }

      } else {
        this.formData = { ...initialFormData };
        this.selectedLocation = { desa: '', dusun: '', rw: '' };
      }
    },
    
    async submitForm() {
      this.isLoading = true;
      this.errorMessage = null;

      const data = new FormData();
      data.append('record[nik]', this.formData.nik || '');
      data.append('record[nama]', this.formData.nama || '');
      data.append('record[tempatlahir]', this.formData.tempatlahir || '');
      data.append('record[tanggallahir]', this.formData.tanggallahir || '');
      data.append('record[idjeniskelamin]', this.formData.idjeniskelamin || '');
      data.append('record[idagama]', this.formData.idagama || '');
      data.append('record[idgolongandarah]', this.formData.idgolongandarah || '');
      data.append('record[idhubungankeluarga]', this.formData.idhubungankeluarga || '');
      data.append('record[idpekerjaan]', this.formData.idpekerjaan || '');
      data.append('record[idpendidikan]', this.formData.idpendidikan || '');
      data.append('record[idpenolongkelahiran]', this.formData.idpenolongkelahiran || '');
      data.append('record[idstatusperkawinan]', this.formData.idstatusperkawinan || '');
      data.append('record[idtempatkelahiran]', this.formData.idtempatkelahiran || '');
      data.append('record[whatsapp]', this.formData.whatsapp || '');
      data.append('record[idrt]', this.formData.idrt || '');

      try {
        if (this.isEditMode) {
          data.append('_method', 'PUT');
          await updateResident(this.residentToEdit.idpenduduk, data);
          this.toast.success("Data penduduk berhasil diperbarui");
        } else {
          await addResident(data);
          this.toast.success("Data penduduk berhasil ditambah");
        }
        this.$emit('save-successful');
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data penduduk");
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
