import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getMartialStatuses = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'status-perkawinan',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} martialStatusId
 */
export const getDetailMartialStatus = (martialStatusId) => {
  if (!martialStatusId) {
    return Promise.reject(new Error("ID status perkawinan tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'status-perkawinan',
      key: martialStatusId,
    },
  });
};

/**
 * Membuat/menambah region baru.
 * @param {Object} martialStatusData 
 */
export const addMartialStatus = (martialStatusData) =>
  apiClient.post('', {
    act: 'status-perkawinan',
    record: martialStatusData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} martialStatusId 
 * @param {Object} martialStatusData 
 */
export const updateMartialStatus = (martialStatusId, martialStatusData) => {
  if (!martialStatusId) {
    return Promise.reject(new Error("ID status perkawinan tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'status-perkawinan',
    key: martialStatusId,
    record: martialStatusData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} martialStatusId
 */
export const deleteMartialStatus = (martialStatusId) => {
  if (!martialStatusId) {
    return Promise.reject(new Error("ID status perkawinan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'status-perkawinan',
      key: martialStatusId,
    },
  });
};