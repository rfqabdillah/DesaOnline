import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getPhysicalStatuses = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'keberadaan-fisik',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} physicalStatusId
 */
export const getDetailPhysicalStatus = (physicalStatusId) => {
  if (!physicalStatusId) {
    return Promise.reject(new Error("ID keberadaan fisik tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'keberadaan-fisik',
      key: physicalStatusId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} physicalStatusData 
 */
export const addPhysicalStatus = (physicalStatusData) =>
  apiClient.post('', {
    act: 'keberadaan-fisik',
    record: physicalStatusData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} physicalStatusId 
 * @param {Object} physicalStatusData 
 */
export const updatePhysicalStatus = (physicalStatusId, physicalStatusData) => {
  if (!physicalStatusId) {
    return Promise.reject(new Error("ID keberadaan fisik tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'keberadaan-fisik',
    key: physicalStatusId,
    record: physicalStatusData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} physicalStatusId
 */
export const deletePhysicalStatus = (physicalStatusId) => {
  if (!physicalStatusId) {
    return Promise.reject(new Error("ID keberadaan fisik tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'keberadaan-fisik',
      key: physicalStatusId,
    },
  });
};