import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getGroupCategories = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'kategori-kelompok',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} groupCategoryId
 */
export const getDetailGroupCategory = (groupCategoryId) => {
  if (!groupCategoryId) {
    return Promise.reject(new Error("ID kategori kelompok tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'kategori-kelompok',
      key: groupCategoryId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} groupCategoryData 
 */
export const addGroupCategory = (groupCategoryData) =>
  apiClient.post('', {
    act: 'kategori-kelompok',
    record: groupCategoryData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} groupCategoryId 
 * @param {Object} groupCategoryData 
 */
export const updateGroupCategory = (groupCategoryId, groupCategoryData) => {
  if (!groupCategoryId) {
    return Promise.reject(new Error("ID kategori kelompok tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'kategori-kelompok',
    key: groupCategoryId,
    record: groupCategoryData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} groupCategoryId
 */
export const deleteGroupCategory = (groupCategoryId) => {
  if (!groupCategoryId) {
    return Promise.reject(new Error("ID kategori kelompok tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'kategori-kelompok',
      key: groupCategoryId,
    },
  });
};