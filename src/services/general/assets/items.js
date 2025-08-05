import apiClient from '../../users';

/**
 * Mengambil daftar barang.
 * @param {Object} params 
 */
export const getItems = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'barang',
      ...params,
    },
  });

/**
 * Mengambil detail satu barang berdasarkan ID-nya.
 * @param {string|number} itemId 
 */
export const getDetailItem = (itemId) => {
  if (!itemId) {
    return Promise.reject(new Error("ID barang tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'barang',
      key: itemId,
    },
  });
};

/**
 * Menambah barang baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addItem = (formData) => {
  formData.append('act', 'barang');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data barang yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} itemId 
 * @param {FormData} formData 
 */
export const updateItem = (itemId, formData) => {
  if (!itemId) {
    return Promise.reject(new Error("ID barang tidak tersedia."));
  }
  formData.append('act', 'barang');
  formData.append('key', itemId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data barang berdasarkan ID-nya.
 * @param {string|number} itemId
 */
export const deleteItem = (itemId) => {
  if (!itemId) {
    return Promise.reject(new Error("ID barang tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'barang',
      key: itemId,
    },
  });
};