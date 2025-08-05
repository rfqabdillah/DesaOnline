import apiClient from '../../users';

/**
 * Mengambil daftar rw.
 * @param {Object} params 
 */
export const getRw = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'rw',
      ...params,
    },
  });

/**
 * Mengambil detail satu rw berdasarkan ID-nya.
 * @param {string|number} rwId 
 */
export const getDetailRw = (rwId) => {
  if (!rwId) {
    return Promise.reject(new Error("ID rw tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'rw',
      key: rwId,
    },
  });
};

/**
 * Menambah rw baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addRw = (formData) => {
  formData.append('act', 'rw');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data rw yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} rwId 
 * @param {FormData} formData 
 */
export const updateRw = (rwId, formData) => {
  if (!rwId) {
    return Promise.reject(new Error("ID rw tidak tersedia."));
  }
  formData.append('act', 'rw');
  formData.append('key', rwId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data rw berdasarkan ID-nya.
 * @param {string|number} rwId
 */
export const deleteRw = (rwId) => {
  if (!rwId) {
    return Promise.reject(new Error("ID rw tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'rw',
      key: rwId,
    },
  });
};