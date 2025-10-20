<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 p-0">
          <div class="login-card">
            <div>
              <div>
                <a class="logo">
                  <img class="img-fluid for-light" src="../assets/images/logo/logo.png" alt="loginpage" />
                  <img class="img-fluid for-dark" src="../assets/images/logo/logo_dark.png" alt="loginpage" />
                </a>
              </div>
              <div class="login-main">
                <Form
                  class="theme-form"
                  :validation-schema="schema"
                  @submit="onSubmit"
                  v-slot="{ errors }"
                >
                  <h4>Masuk</h4>
                  <p>Masukkan Email dan Password untuk masuk</p>

                  <div class="form-group">
                    <label class="col-form-label">Email</label>
                    <Field
                      name="email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="email@gmail.com"
                      v-model="user.email"
                    />
                    <span class="validate-error">{{ errors.email }}</span>
                  </div>

                  <div class="form-group">
                    <label class="col-form-label">Password</label>
                    <div class="d-flex password-group">
                      <Field
                        name="password"
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control password-input"
                        :class="{ 'is-invalid': errors.password }"
                        placeholder="*********"
                        v-model="user.password"
                      />

                      <div class="eye-container" @click="togglePassword">
                        <vue-feather :type="showPassword ? 'eye-off' : 'eye'" size="18" />
                      </div>
                    </div>
                    <span class="validate-error">{{ errors.password }}</span>
                  </div>

                  <div class="form-group mb-0">
                    <div class="checkbox p-0">
                      <input id="checkbox1" type="checkbox" />
                      <label class="text-muted" for="checkbox1">Remember password</label>
                    </div>
                    <div class="text-end mt-3">
                      <button class="btn btn-primary btn-block w-100" type="submit">
                        Sign in
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { login as loginAPI } from "@/services/auth";

export default {
  name: "login",
  components: { Form, Field },
  data() {
    return {
      showPassword: false,
      user: {
        email: "",
        password: "",
      },
      toast: useToast(),
      schema: yup.object({
        email: yup
          .string()
          .email("Format email tidak valid")
          .required("Email wajib diisi"),
        password: yup.string().required("Password wajib diisi"),
      }),
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async onSubmit() {
      try {
        const result = await loginAPI(this.user.email, this.user.password);
        console.log("API Response:", result);

        if (result.success && result.success.token) {
          const token = result.success.token;
          const userProfile = result.success.data;

          localStorage.setItem("token", token);
          localStorage.setItem(
            "userData",
            JSON.stringify({ data: [userProfile] })
          );

          this.toast.success("Login berhasil! Selamat datang");
          this.$router.push("/");
        } 
        else if (result.error && result.error) {
          this.toast.error("Login gagal. Periksa kembali email dan password kamu");
        } 
        else {
          this.toast.error("Login gagal. Pastikan data kamu benar.");
        }

      } catch (error) {
        console.error("Login Error:", error);

        if (error.response && error.response.data) {
          const message =
            error.response.data.error ||
            error.response.data.message ||
            "Login gagal. Periksa kembali email dan password kamu.";
          this.toast.error(message);
        } else {
          this.toast.error("Tidak bisa terhubung ke server.");
        }
      }
    },

  },
};
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.1rem rgba(220, 53, 69, 0.25);
}

.validate-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
}

.password-group {
  display: flex;
  align-items: stretch;
  gap: 0; 
}

.password-input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.eye-container {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-left: none; 
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.eye-container:hover {
  background-color: #e9ecef;
  color: #0d6efd;
}

.eye-container svg {
  color: #6c757d;
  transition: color 0.2s ease;
}

.eye-container:hover svg {
  color: #0d6efd;
}
</style>
