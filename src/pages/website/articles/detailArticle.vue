<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Detail Artikel</h5>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div v-if="isLoading" class="text-center p-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Memuat data...</p>
        </div>

        <div v-else-if="error" class="text-center p-5 text-danger">
          <i class="fa fa-exclamation-triangle fa-3x mb-3"></i>
          <h4>Terjadi Kesalahan</h4>
          <p>{{ error }}</p>
        </div>

        <div v-else-if="article" class="article-container">
          <h2 class="article-title mb-3">{{ article.judul || 'Judul Belum Tersedia' }}</h2>
          
          <div class="article-meta mb-4">
            <span>
              <i class="fa fa-user me-2"></i>
              {{ article.pengguna?.nama || 'Penulis tidak diketahui' }}
            </span>
            <span class="mx-2">|</span>
            <span>
              <i class="fa fa-tag me-2"></i>
              {{ article.kategoriartikel?.nama_kategori_artikel || 'Kategori tidak diketahui' }}
            </span>
            <span class="mx-2">|</span>
            
            <span>
              <i class="fa fa-link me-2"></i>
              {{ article.slug || 'Slug tidak tersedia' }}
            </span>
            <span class="mx-2">|</span>
            <span>
              <i class="fa fa-calendar me-2"></i>
              {{ article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' }}
            </span>
          </div>

          <img v-if="article.gambar" :src="article.gambar" alt="Gambar Artikel" class="article-image img-fluid rounded mb-4">
          
          <div class="detail-section">
            <h4><i class="fa fa-file-text-o me-2"></i>Konten Artikel</h4>
            <div class="text-content" v-html="article.konten || 'Belum ada konten.'"></div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetailArticle } from '@/services/general/website/article';

export default {
  name: 'DetailArticleModal', 
  props: {
    articleToView: {
      type: Object,
      default: () => null
    }
  },
  emits: ['close'],
  data() {
    return {
      article: null,
      isLoading: false,
      error: null,
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchArticleDetail() { 
      const articleId = this.articleToView?.idartikel;

      if (!articleId) {
        this.error = 'ID artikel tidak valid dari data yang diterima.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.article = null;
      
      try {
        const response = await getDetailArticle(articleId);
        const responseData = response.data; 

        if (
          Array.isArray(responseData) &&
          responseData.length > 0 &&
          responseData[0] &&
          Array.isArray(responseData[0].data) &&
          responseData[0].data.length > 0
        ) {
          this.article = responseData[0].data[0];
        } else {
          this.error = 'Data artikel tidak ditemukan atau format respons tidak sesuai.';
          console.warn(`Struktur data yang diterima untuk ID ${articleId}:`, responseData);
        }
      } catch (err) {
        console.error("Gagal mengambil detail artikel:", err);
        this.error = err.message || 'Terjadi kesalahan saat memuat data.';
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchArticleDetail();
  },
  watch: {
    articleToView: {
      handler(newValue, oldValue) {
        if (newValue?.idartikel !== oldValue?.idartikel) {
          this.fetchArticleDetail();
        }
      },
      deep: true 
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050;
}
.modal-content {
  background: white; border-radius: 8px; width: 90%;
  max-width: 1200px; max-height: 90vh;
  box-shadow: 0 5px 15px rgba(0,0,0,.5);
  display: flex; flex-direction: column;
}
.modal-header, .modal-footer {
  padding: 1rem; flex-shrink: 0;
}
.modal-body {
  padding: 1.5rem 2rem; overflow-y: auto; flex-grow: 1;
}
.modal-header {
  border-bottom: 1px solid #dee2e6; display: flex;
  justify-content: space-between; align-items: center;
}
.modal-footer {
  border-top: 1px solid #dee2e6; display: flex;
  justify-content: flex-end;
}
.article-title {
  font-weight: 600; color: #333;
}
.article-meta {
  color: #6c757d; font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.article-image {
  display: block;
  max-width: 60%; 
  margin-left: auto; 
  margin-right: auto; 
  max-height: 350px; 
  object-fit: cover;
}
.detail-section {
  margin-top: 1.5rem;
}
.detail-section h4 {
  font-size: 1.2rem; font-weight: 600;
  margin-bottom: 1rem; display: flex; align-items: center;
}
.text-content {
  white-space: pre-wrap; 
  color: #212529; line-height: 1.7;
}
</style>