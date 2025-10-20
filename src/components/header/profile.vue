<template>
  <li class="profile-nav onhover-dropdown pe-0 py-0">
    <div class="media profile-media">
      <img 
        class="b-r-10 profile-img" 
        :src="user.photo || require('@/assets/images/dashboard/profile.png')" 
        alt="Foto Profil" 
      />
      <div class="media-body">
        <span>{{ user.name }}</span>
        <p class="mb-0 font-roboto">
          {{ user.role_name }} <i class="middle fa fa-angle-down"></i>
        </p>
      </div>
    </div>

    <ul class="profile-dropdown onhover-show-div">
      <li>
        <vue-feather type="user"></vue-feather>
        <span>Account</span>
      </li>
      <li @click="logout" style="cursor: pointer">
        <vue-feather type="log-in"></vue-feather>
        <span>Log out</span>
      </li>
    </ul>
  </li>
</template>

<script>
import apiClient from '@/services/users';

export default {
  name: 'Profile',
  data() {
    return {
      user: {
        name: 'Pengguna',
        role_name: 'Role',
        photo: null
      }
    };
  },
  mounted() {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        const userProfile = parsedData.data?.[0];

        if (userProfile) {
          this.user.name = userProfile.nama || 'Pengguna';
          this.user.role_name = userProfile.role?.nama_level || 'Role';
          this.user.photo = userProfile.foto 
            ? userProfile.foto.startsWith('http')
              ? userProfile.foto
              : `${import.meta.env.VITE_BASE_URL || ''}/${userProfile.foto}`
            : null;
        }
      } catch (error) {
        console.error("Gagal parse user data dari localStorage:", error);
      }
    }
  },
  methods: {
    async logout() {
      const result = await this.$swal.fire({
        text: "Apakah Anda yakin ingin keluar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd', 
        cancelButtonColor: '#efefef',
        confirmButtonText: 'Konfirmasi',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        try {
          apiClient.get('/logout').catch(err => {
            console.error('API logout gagal, proses logout klien tetap dilanjutkan:', err);
          });
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          
          this.$router.replace('/auth');
          this.$swal.fire(
            'Berhasil!',
            'Anda telah berhasil keluar.',
            'success'
          );
        }
      }
    }
  }
};
</script>

<style scoped>
.profile-img {
  width: 35px;
  height: 35px;
  object-fit: cover;
}
</style>