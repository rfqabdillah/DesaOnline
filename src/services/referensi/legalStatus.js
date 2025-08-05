import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getLegalStatuses = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'status-hak',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} legalStatusId
 */
export const getDetailLegalStatus = (legalStatusId) => {
  if (!legalStatusId) {
    return Promise.reject(new Error("ID status hak tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'status-hak',
      key: legalStatusId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} legalStatusData 
 */
export const addLegalStatus = (legalStatusData) =>
  apiClient.post('', {
    act: 'status-hak',
    record: legalStatusData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} legalStatusId 
 * @param {Object} legalStatusData 
 */
export const updateLegalStatus = (legalStatusId, legalStatusData) => {
  if (!legalStatusId) {
    return Promise.reject(new Error("ID status hak tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'status-hak',
    key: legalStatusId,
    record: legalStatusData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} legalStatusId
 */
export const deleteLegalStatus = (legalStatusId) => {
  if (!legalStatusId) {
    return Promise.reject(new Error("ID status hak tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'status-hak',
      key: legalStatusId,
    },
  });
};