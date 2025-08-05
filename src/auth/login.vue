<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 p-0">
          <div class="login-card">
            <div>
              <div>
                <a class="logo">
                  <img class="img-fluid for-light" src="../assets/images/logo/logo.png" alt="looginpage" />
                  <img class="img-fluid for-dark" src="../assets/images/logo/logo_dark.png" alt="looginpage" />
                </a>
              </div>
              <div class="login-main">
                <form class="theme-form">
                  <h4>Sign in to account</h4>
                  <p>Enter your email & password to login</p>

                  <!-- Email -->
                  <div class="form-group">
                    <label class="col-form-label">Email Address</label>
                    <input class="form-control" type="email" required placeholder="email@gmail.com"
                      v-model="user.email.value" />
                    <span class="validate-error" v-if="!user.email.value || !validEmail(user.email.value)">
                      {{ user.email.errormsg }}
                    </span>
                  </div>

                  <!-- Password -->
                  <div class="form-group">
                    <label class="col-form-label">Password</label>
                    <div class="form-input position-relative">
                      <input
                        class="form-control"
                        :type="showPassword ? 'text' : 'password'"
                        required
                        placeholder="*********"
                        v-model="user.password.value"
                      />
                      <span
                        class="position-absolute end-0 top-50 translate-middle-y me-3"
                        style="cursor: pointer"
                        @click="togglePassword"
                      >
                        <vue-feather :type="showPassword ? 'eye-off' : 'eye'" />
                      </span>
                      <span class="validate-error" v-if="user.password.value.length < 7">
                        {{ user.password.errormsg }}
                      </span>
                    </div>
                  </div>

                  <!-- Remember + Button -->
                  <div class="form-group mb-0">
                    <div class="checkbox p-0">
                      <input id="checkbox1" type="checkbox" />
                      <label class="text-muted" for="checkbox1">Remember password</label>
                    </div>
                    <div class="text-end mt-3">
                      <button class="btn btn-primary btn-block w-100" type="submit" @click.prevent="login">
                        Sign in
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login as loginAPI } from '@/services/auth';

export default {
  name: 'login',
  data() {
    return {
      showPassword: false,
      user: {
        email: {
          value: '',
          errormsg: ''
        },
        password: {
          value: '',
          errormsg: ''
        }
      }
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      this.user.email.errormsg = '';
      this.user.password.errormsg = '';

      if (!this.user.email.value || !this.validEmail(this.user.email.value)) {
        this.user.email.errormsg = 'Email tidak valid.';
        return;
      }

      if (!this.user.password.value || this.user.password.value.length < 6) {
        this.user.password.errormsg = 'Password minimal 6 karakter.';
        return;
      }

      try {
        const result = await loginAPI(this.user.email.value, this.user.password.value);

        const token = result.data?.token;
        console.log("API Response:", result);
        if (result.success && result.success.token) {
          localStorage.setItem('User', JSON.stringify({
            token: result.success.token,
            email: this.user.email.value,
            id_pengguna: result.success.data.id_pengguna
          }));
          
          this.$router.push('/');
        } else {
          alert('Login gagal');
        }
      } catch (error) {
        if (error.response) {
          alert("Login gagal: " + (error.response.data.message || 'Terjadi kesalahan.'));
        } else {
          alert("Tidak bisa terhubung ke server.");
        }
        console.error(error);
      }
    },
    validEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }
};
</script>
