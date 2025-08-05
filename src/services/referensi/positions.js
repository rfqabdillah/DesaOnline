import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getPositions = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'jabatan',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} positionId
 */
export const getDetailPosition = (positionId) => {
  if (!positionId) {
    return Promise.reject(new Error("ID jabatan tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'jabatan',
      key: positionId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} positionData 
 */
export const addPosition = (positionData) =>
  apiClient.post('', {
    act: 'jabatan',
    record: positionData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} positionId 
 * @param {Object} positionData 
 */
export const updatePosition = (positionId, positionData) => {
  if (!positionId) {
    return Promise.reject(new Error("ID jabatan tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'jabatan',
    key: positionId,
    record: positionData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} positionId
 */
export const deletePosition = (positionId) => {
  if (!positionId) {
    return Promise.reject(new Error("ID jabatan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'jabatan',
      key: positionId,
    },
  });
};