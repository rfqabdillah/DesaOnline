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
import axios from 'axios';

export default {
  name: 'Profile',
  data() {
    return {
      user: {
        name: '',
        role_name: ''
      }
    };
  },
mounted() {
  const userData = JSON.parse(localStorage.getItem('User')) || {};
  const userId = userData.id_pengguna;

  // console.log("Isi local ", userData);
  // console.log("Isi id_pengguna ", userData.id_pengguna);
  // console.log(userId, userData.token);

  if (userId) {
    axios.get('/api/api', { 
      params: { 
        act: 'users',
        key: userId
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
      }
    })
    .then(res => {
      const userInfo = res.data?.[0]?.data?.[0];
      if (userInfo) {
        this.user.name = userInfo.name || 'Pengguna';
        this.user.role_name = userInfo.roles?.role_name || 'Role';
      }
    })
    .catch(err => {
      console.error('Gagal mengambil data user:', err);
    });
  }
},
  methods: {
    logout() {
      const token = JSON.parse(localStorage.getItem('User'))?.token;

      axios.get('/api/api/logout', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .finally(() => {
        localStorage.removeItem('User');
        this.$router.replace('/auth');
      });
    }
  }
};
</script>