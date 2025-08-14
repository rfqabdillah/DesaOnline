<template>
  <li class="profile-nav onhover-dropdown pe-0 py-0">
    <div class="media profile-media">
      <img class="b-r-10" src="@/assets/images/dashboard/profile.png" alt="" />
      <div class="media-body">
        <span>{{ user.name }}</span>
        <p class="mb-0 font-roboto">
          {{ user.role_name }} <i class="middle fa fa-angle-down"></i>
        </p>
      </div>
    </div>
    <ul class="profile-dropdown onhover-show-div">
      <li>
        <vue-feather type="user"></vue-feather><span>Account</span>
      </li>
      <li @click="logout" style="cursor: pointer">
        <vue-feather type="log-in"></vue-feather><span>Log out</span>
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
        role_name: 'Role' 
      }
    };
  },
  mounted() {
    this.fetchUserProfile();
  },
  methods: {
    fetchUserProfile() {
      const userData = JSON.parse(localStorage.getItem('User')) || {};
      const userId = userData.id_pengguna;

      if (!userId) {
        return;
      }

      apiClient.get('', { 
        params: { 
          act: 'users',
          key: userId
        }
      })
      .then(res => {
        const userInfo = res.data?.data?.[0]; 
        
        if (userInfo) {
          this.user.name = userInfo.name || 'Pengguna';
          this.user.role_name = userInfo.roles?.role_name || 'Role';
        }
      })
      .catch(err => {
        console.error('Gagal mengambil data user:', err);
        // Jika token tidak valid (error 401/403), paksa logout
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.logout();
        }
      });
    },

    logout() {
      apiClient.get('/logout')
        .then(response => {
          console.log('Logout dari server berhasil.', response.data);
          // Hanya jika server berhasil, bersihkan data di sisi klien
          localStorage.removeItem('User');
          this.$router.replace('/auth');
        })
        .catch(error => {
          console.error('API logout gagal:', error);
          // Jika API gagal, tetap log out dari sisi klien agar pengguna tidak terjebak
          alert('Sesi di server mungkin masih aktif, namun Anda akan dikeluarkan dari aplikasi.');
          localStorage.removeItem('User');
          this.$router.replace('/auth');
        });
    }
  }
};
</script>