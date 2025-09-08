import apiClient from '../../users';

/**
 * Mengambil daftar regulasi.
 * @param {Object} params 
 */
export const getRegulations = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'regulasi',
      ...params,
    },
  });

/**
 * Mengambil detail satu regulasi berdasarkan ID-nya.
 * @param {string|number} regulationId 
 */
export const getDetailRegulation = (regulationId) => {
  if (!regulationId) {
    return Promise.reject(new Error("ID regulasi tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'regulasi',
      key: regulationId,
    },
  });
};

/**
 * Menambah regulasi baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addRegulation = (formData) => {
  formData.append('act', 'regulasi');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data regulasi yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} regulationId 
 * @param {FormData} formData 
 */
export const updateRegulation = (regulationId, formData) => {
  if (!regulationId) {
    return Promise.reject(new Error("ID regulasi tidak tersedia."));
  }
  formData.append('act', 'regulasi');
  formData.append('key', regulationId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data regulasi berdasarkan ID-nya.
 * @param {string|number} regulationId
 */
export const deleteRegulation = (regulationId) => {
  if (!regulationId) {
    return Promise.reject(new Error("ID regulasi tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'regulasi',
      key: regulationId,
    },
  });
};