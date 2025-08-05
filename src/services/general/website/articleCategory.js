import apiClient from '../../users';

/**
 * Mengambil daftar kategori artikel.
 * @param {Object} params 
 */
export const getArticleCategories = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'kategori-artikel',
      ...params,
    },
  });

/**
 * Mengambil detail satu kategori artikel berdasarkan ID-nya.
 * @param {string|number} articleCategoryId 
 */
export const getDetailArticleCategory = (articleCategoryId) => {
  if (!articleCategoryId) {
    return Promise.reject(new Error("ID kategori artikel tidak tersedia"));
  }
  return apiClient.get('', {
    params: {
      act: 'kategori-artikel',
      key: articleCategoryId,
    },
  });
};

/**
 * Menambah kategori artikel baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addArticleCategory = (formData) => {
  formData.append('act', 'kategori-artikel');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data kategori artikel yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} articleCategoryId 
 * @param {FormData} formData 
 */
export const updateArticleCategory = (articleCategoryId, formData) => {
  if (!articleCategoryId) {
    return Promise.reject(new Error("ID kategori artikel tidak tersedia"));
  }
  formData.append('act', 'kategori-artikel');
  formData.append('key', articleCategoryId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data kategori artikel berdasarkan ID-nya.
 * @param {string|number} articleCategoryId
 */
export const deleteArticleCategory = (articleCategoryId) => {
  if (!articleCategoryId) {
    return Promise.reject(new Error("ID kategori artikel tidak tersedia"));
  }
  return apiClient.delete('', {
    data: {
      act: 'kategori-artikel',
      key: articleCategoryId,
    },
  });
};