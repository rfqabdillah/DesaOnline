import apiClient from '../../users';

/**
 * Mengambil daftar artikel.
 * @param {Object} params 
 */
export const getArticles = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'artikel',
      ...params,
    },
  });

/**
 * Mengambil detail satu artikel berdasarkan ID-nya.
 * @param {string|number} articleId 
 */
export const getDetailArticle = (articleId) => {
  if (!articleId) {
    return Promise.reject(new Error("ID artikel tidak tersedia"));
  }
  return apiClient.get('', {
    params: {
      act: 'artikel',
      key: articleId,
    },
  });
};

/**
 * Menambah artikel baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addArticle = (formData) => {
  formData.append('act', 'artikel');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data artikel yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} articleId 
 * @param {FormData} formData 
 */
export const updateArticle = (articleId, formData) => {
  if (!articleId) {
    return Promise.reject(new Error("ID artikel tidak tersedia"));
  }
  formData.append('act', 'artikel');
  formData.append('key', articleId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data artikel berdasarkan ID-nya.
 * @param {string|number} articleId
 */
export const deleteArticle = (articleId) => {
  if (!articleId) {
    return Promise.reject(new Error("ID artikel tidak tersedia"));
  }
  return apiClient.delete('', {
    data: {
      act: 'artikel',
      key: articleId,
    },
  });
};