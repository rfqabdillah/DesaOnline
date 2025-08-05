import apiClient from '../users'; 

/**
 * Mengambil daftar pekerjaan
 * @param {Object} params 
 */

export const getOccupations = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'pekerjaan',
      ...params,
    },
  });

/**
 * Mengambil detail satu pekerjaan berdasarkan ID-nya.
 * @param {string|number} occupationId 
 */
export const getDetailOccupation = (occupationId) => {
  if (!occupationId) {
    return Promise.reject(new Error("ID pekerjaan tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'pekerjaan',
      key: occupationId,
    },
  });
};

/**
 * Membuat/menambah pekerjaan baru.
 * @param {Object} occupationData 
 */
export const addOccupation = (occupationData) =>
  apiClient.post('', {
    act: 'pekerjaan',
    record: occupationData,
  });

/**
 * Memperbarui pekerjaan yang ada berdasarkan ID-nya.
 * @param {string|number} occupationId 
 * @param {Object} occupationData 
 */
export const updateOccupation = (occupationId, occupationData) => {
  if (!occupationId) {
    return Promise.reject(new Error("ID pekerjaan tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'pekerjaan',
    key: occupationId,
    record: occupationData,
  });
};

/**
 * Menghapus pekerjaan berdasarkan ID-nya.
 * @param {string|number} occupationId
 */
export const deleteOccupation = (occupationId) => {
  if (!occupationId) {
    return Promise.reject(new Error("ID pekerjaan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'pekerjaan',
      key: occupationId,
    },
  });
};