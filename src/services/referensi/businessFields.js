import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getBusinessFields = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'bidang-usaha',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} businessFieldId
 */
export const getDetailBusinessField = (businessFieldId) => {
  if (!businessFieldId) {
    return Promise.reject(new Error("ID bidang usaha tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'bidang-usaha',
      key: businessFieldId,
    },
  });
};

/**
 * Membuat/menambah region baru.
 * @param {Object} businessFieldData 
 */
export const addBusinessField = (businessFieldData) =>
  apiClient.post('', {
    act: 'bidang-usaha',
    record: businessFieldData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} businessFieldId 
 * @param {Object} businessFieldData 
 */
export const updateBusinessField = (businessFieldId, businessFieldData) => {
  if (!businessFieldId) {
    return Promise.reject(new Error("ID bidang usaha tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'bidang-usaha',
    key: businessFieldId,
    record: businessFieldData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} businessFieldId
 */
export const deleteBusinessField = (businessFieldId) => {
  if (!businessFieldId) {
    return Promise.reject(new Error("ID bidang usaha tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'bidang-usaha',
      key: businessFieldId,
    },
  });
};