import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getAcquisitions = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'perolehan',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} acquisitionId
 */
export const getDetailAcquisition = (acquisitionId) => {
  if (!acquisitionId) {
    return Promise.reject(new Error("ID perolehan tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'perolehan',
      key: acquisitionId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} acquisitionData 
 */
export const addAcquisition = (acquisitionData) =>
  apiClient.post('', {
    act: 'perolehan',
    record: acquisitionData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} acquisitionId 
 * @param {Object} acquisitionData 
 */
export const updateAcquisition = (acquisitionId, acquisitionData) => {
  if (!acquisitionId) {
    return Promise.reject(new Error("ID perolehan tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'perolehan',
    key: acquisitionId,
    record: acquisitionData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} acquisitionId
 */
export const deleteAcquisition = (acquisitionId) => {
  if (!acquisitionId) {
    return Promise.reject(new Error("ID perolehan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'perolehan',
      key: acquisitionId,
    },
  });
};