import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getConditions = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'kondisi',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} conditionId
 */
export const getDetailCondition = (conditionId) => {
  if (!conditionId) {
    return Promise.reject(new Error("ID kondisi tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'kondisi',
      key: conditionId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} conditionData 
 */
export const addCondition = (conditionData) =>
  apiClient.post('', {
    act: 'kondisi',
    record: conditionData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} conditionId 
 * @param {Object} conditionData 
 */
export const updateCondition = (conditionId, conditionData) => {
  if (!conditionId) {
    return Promise.reject(new Error("ID kondisi tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'kondisi',
    key: conditionId,
    record: conditionData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} conditionId
 */
export const deleteCondition = (conditionId) => {
  if (!conditionId) {
    return Promise.reject(new Error("ID kondisi tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'kondisi',
      key: conditionId,
    },
  });
};