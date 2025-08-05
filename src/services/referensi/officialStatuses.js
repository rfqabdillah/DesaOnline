import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getOfficialStatuses = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'status-perangkat',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} officialStatusId
 */
export const getDetailOfficialStatus = (officialStatusId) => {
  if (!officialStatusId) {
    return Promise.reject(new Error("ID status perangkat tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'status-perangkat',
      key: officialStatusId,
    },
  });
};

/**
 * Membuat/menambah region baru.
 * @param {Object} officialStatusData 
 */
export const addOfficialStatus = (officialStatusData) =>
  apiClient.post('', {
    act: 'status-perangkat',
    record: officialStatusData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} officialStatusId 
 * @param {Object} officialStatusData 
 */
export const updateOfficialStatus = (officialStatusId, officialStatusData) => {
  if (!officialStatusId) {
    return Promise.reject(new Error("ID status perangkat tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'status-perangkat',
    key: officialStatusId,
    record: officialStatusData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} officialStatusId
 */
export const deleteOfficialStatus = (officialStatusId) => {
  if (!officialStatusId) {
    return Promise.reject(new Error("ID status perangkat tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'status-perangkat',
      key: officialStatusId,
    },
  });
};