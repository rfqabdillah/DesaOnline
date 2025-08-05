import apiClient from '../../users';

/**
 * Mengambil daftar pengurus usaha.
 * @param {Object} params 
 */
export const getManagements = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'pengurus-usaha',
      ...params,
    },
  });

/**
 * Mengambil detail satu pengurus usaha berdasarkan ID-nya.
 * @param {string|number} managementId 
 */
export const getDetailManagement = (managementId) => {
  if (!managementId) {
    return Promise.reject(new Error("ID pengurus usaha tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'pengurus-usaha',
      key: managementId,
    },
  });
};

/**
 * Menambah pengurus usaha baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addManagement = (formData) => {
  formData.append('act', 'pengurus-usaha');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data pengurus usaha yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} managementId 
 * @param {FormData} formData 
 */
export const updateManagement = (managementId, formData) => {
  if (!managementId) {
    return Promise.reject(new Error("ID pengurus usaha tidak tersedia."));
  }
  formData.append('act', 'pengurus-usaha');
  formData.append('key', managementId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data pengurus usaha berdasarkan ID-nya.
 * @param {string|number} managementId
 */
export const deleteManagement = (managementId) => {
  if (!managementId) {
    return Promise.reject(new Error("ID pengurus usaha tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'pengurus-usaha',
      key: managementId,
    },
  });
};