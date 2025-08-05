import apiClient from '../../users';

/**
 * Mengambil daftar rt.
 * @param {Object} params 
 */
export const getRt = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'rt',
      ...params,
    },
  });

/**
 * Mengambil detail satu rt berdasarkan ID-nya.
 * @param {string|number} rtId 
 */
export const getDetailRt = (rtId) => {
  if (!rtId) {
    return Promise.reject(new Error("ID rt tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'rt',
      key: rtId,
    },
  });
};

/**
 * Menambah rt baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addRt = (formData) => {
  formData.append('act', 'rt');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data rt yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} rtId 
 * @param {FormData} formData 
 */
export const updateRt = (rtId, formData) => {
  if (!rtId) {
    return Promise.reject(new Error("ID rt tidak tersedia."));
  }
  formData.append('act', 'rt');
  formData.append('key', rtId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data rt berdasarkan ID-nya.
 * @param {string|number} rtId
 */
export const deleteRt = (rtId) => {
  if (!rtId) {
    return Promise.reject(new Error("ID rt tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'rt',
      key: rtId,
    },
  });
};