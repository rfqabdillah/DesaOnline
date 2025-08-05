import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getItemCategories = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'kategori-barang',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} itemCategoryId
 */
export const getDetailItemCategory = (itemCategoryId) => {
  if (!itemCategoryId) {
    return Promise.reject(new Error("ID kategori barang tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'kategori-barang',
      key: itemCategoryId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} itemCategoryData 
 */
export const addItemCategory = (itemCategoryData) =>
  apiClient.post('', {
    act: 'kategori-barang',
    record: itemCategoryData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} itemCategoryId 
 * @param {Object} itemCategoryData 
 */
export const updateItemCategory = (itemCategoryId, itemCategoryData) => {
  if (!itemCategoryId) {
    return Promise.reject(new Error("ID kategori barang tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'kategori-barang',
    key: itemCategoryId,
    record: itemCategoryData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} itemCategoryId
 */
export const deleteItemCategory = (itemCategoryId) => {
  if (!itemCategoryId) {
    return Promise.reject(new Error("ID kategori barang tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'kategori-barang',
      key: itemCategoryId,
    },
  });
};