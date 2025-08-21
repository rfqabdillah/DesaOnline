<template>
  <div>
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Edit Data User' : 'Tambah Data User' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Nama Lengkap -->
            <div class="mb-3">
              <label class="form-label">Nama Lengkap</label>
              <input type="text" class="form-control" v-model="formData.name" placeholder="Masukkan nama lengkap" required />
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="formData.email" placeholder="Masukkan email" required />
            </div>

            <!-- Password -->
            <div class="mb-3">
                <label class="col-form-label">Password</label>
                <div class="form-input position-relative">
                    <input :type="passwordFieldType" class="form-control pe-5" v-model="formData.password" placeholder="*********" :required="!isEditMode" />
                    <span class="position-absolute end-0 top-50 translate-middle-y me-3" style="cursor: pointer" @click="togglePasswordVisibility">
                        <vue-feather :type="passwordFieldType === 'password' ? 'eye' : 'eye-off'" />
                    </span>
                </div>
                <small v-if="isEditMode" class="form-text text-muted">Kosongkan jika tidak ingin mengubah password.</small>
            </div>

            <!-- Konfirmasi Password -->
            <div class="mb-3">
                <label class="col-form-label">Konfirmasi Password</label>
                <div class="form-input position-relative">
                    <input :type="confirmPasswordFieldType" class="form-control pe-5" v-model="formData.confirm_password" placeholder="*********" :required="formData.password !== ''" />
                    <span class="position-absolute end-0 top-50 translate-middle-y me-3" style="cursor: pointer" @click="toggleConfirmPasswordVisibility">
                        <vue-feather :type="confirmPasswordFieldType === 'password' ? 'eye' : 'eye-off'" />
                    </span>
                </div>
            </div>

            <!-- Role -->
            <div class="mb-3">
              <label class="form-label">Role</label>
              <select class="form-select" v-model="formData.idlevel" required :disabled="isListLoading">
                <option disabled value="">
                  {{ isListLoading ? 'Memuat...' : 'Pilih Role' }}
                </option>
                <option v-for="role in roleList" :key="role.idlevel" :value="role.idlevel">
                  {{ role.namalevel }}
                </option>
              </select>
            </div>

            <!-- Gender -->
            <div class="mb-3">
              <label class="form-label">Gender</label>
              <select class="form-select" v-model="formData.gender">
                  <option value="" disabled>Pilih Gender</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
              </select>
            </div>

            <!-- Tempat & Tanggal Lahir -->
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Tempat Lahir</label>
                    <input type="text" class="form-control" v-model="formData.pob" placeholder="Tempat lahir"/>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Tanggal Lahir</label>
                    <input type="date" class="form-control" v-model="formData.dob"/>
                </div>
            </div>

            <!-- Telepon & Alamat -->
            <div class="mb-3">
                <label class="form-label">No. Telepon</label>
                <input type="tel" class="form-control" v-model="formData.telp" placeholder="Masukkan nomor telepon" />
            </div>
            <div class="mb-3">
                <label class="form-label">Alamat</label>
                <textarea class="form-control" v-model="formData.address" rows="3" placeholder="Masukkan alamat"></textarea>
            </div>
            
            <!-- Upload Foto -->
            <div class="mb-3">
              <label class="form-label">Upload Foto</label>
              <input type="file" class="form-control" accept="image/*" @change="handlePhotoUpload" />
              
              <div class="mt-2">
                <div v-if="photoPreviewUrl">
                  <img :src="photoPreviewUrl" alt="Preview Foto" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
                <div v-else-if="isEditMode && formData.photo">
                  <img :src="formData.photo" alt="Foto Saat Ini" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" />
                </div>
              </div>
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
import { getRoles } from '@/services/referensi/roles';
import { addUser, updateUser } from '@/services/referensi/users'; 
import { useToast } from "vue-toastification";

const initialFormData = {
  name: '',
  email: '',
  password: '',
  confirm_password: '',
  idlevel: '', 
  gender: '',
  pob: '', 
  dob: '', 
  telp: '',
  address: '',
  photo: null,
};

export default {
  name: 'AddEditUserModal',
  props: {
    userToEdit: { type: Object, default: null },
  },
  data() {
    return {
      formData: { ...initialFormData },
      selectedPhotoFile: null,
      photoPreviewUrl: null, 
      roleList: [], 
      isListLoading: false, 
      isLoading: false,
      errorMessage: null,
      toast: useToast(),
      passwordFieldType: 'password',
      confirmPasswordFieldType: 'password',
    };
  },
  
  computed: {
    isEditMode() {
      return !!this.userToEdit;
    }
  },
  watch: {
    userToEdit: {
      handler(newData) {
        if (newData) {
          this.formData = { ...initialFormData, ...newData };
          this.formData.password = ''; 
          this.formData.confirm_password = '';
        } else {
          this.formData = { ...initialFormData };
        }
        this.errorMessage = null;
        this.selectedPhotoFile = null;
        this.photoPreviewUrl = null;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.fetchRoleList();
  },
  beforeUnmount() {
    if (this.photoPreviewUrl) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleOverlayClick(e) {
      if (e.target === e.currentTarget)
        this.closeModal();
    },
    async fetchRoleList() {
      this.isListLoading = true;
      try {
        const response = await getRoles({limit: -1}); 
        this.roleList = response.data?.data || response.data?.[0]?.data || [];
      } catch (error) {
        this.toast.error("Gagal memuat daftar role");
      } finally {
        this.isListLoading = false;
      }
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0];

      if (this.photoPreviewUrl) {
        URL.revokeObjectURL(this.photoPreviewUrl);
      }

      if (!file) {
        this.selectedPhotoFile = null;
        this.photoPreviewUrl = null;
        return;
      }
      this.selectedPhotoFile = file;
      this.photoPreviewUrl = URL.createObjectURL(file);
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    },
    async submitForm() {
      this.errorMessage = null;

      if (this.formData.password !== this.formData.confirm_password) {
        this.errorMessage = 'Password dan Konfirmasi Password tidak cocok.';
        this.toast.error('Password tidak cocok!');
        return; 
      }

      this.isLoading = true;
      const data = new FormData();

      data.append('record[name]', this.formData.name);
      data.append('record[email]', this.formData.email);
      data.append('record[idlevel]', this.formData.idlevel);
      data.append('record[gender]', this.formData.gender);
      data.append('record[pob]', this.formData.pob);
      data.append('record[dob]', this.formData.dob);
      data.append('record[telp]', this.formData.telp);
      data.append('record[address]', this.formData.address);

      if (this.formData.password) {
        data.append('record[password]', this.formData.password);
      }

      if (this.selectedPhotoFile) {
        data.append('upload_photo', this.selectedPhotoFile);
      }

      try {
        let response;

        if (this.isEditMode) {
          data.append('_method', 'PUT');
          response = await updateUser(this.userToEdit.user_id, data);
          this.toast.success("Data pengguna berhasil diperbarui");
        } else {
          response = await addUser(data);
          this.toast.success("Data pengguna berhasil ditambah");
        }

        this.$emit('save-successful', response.data.data);
        this.closeModal();
      } catch (error) {
        this.errorMessage = error.response?.data?.failed || error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi';
        this.toast.error("Gagal menyimpan data pengguna");
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
