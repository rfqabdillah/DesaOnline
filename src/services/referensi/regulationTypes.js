import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getRegulationTypes = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'jenis-regulasi',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} regulationTypeId
 */
export const getDetailRegulationType = (regulationTypeId) => {
  if (!regulationTypeId) {
    return Promise.reject(new Error("ID jenis regulasi tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'jenis-regulasi',
      key: regulationTypeId,
    },
  });
};

/**
 * Membuat/menambah baru.
 * @param {Object} regulationTypeData 
 */
export const addRegulationType = (regulationTypeData) =>
  apiClient.post('', {
    act: 'jenis-regulasi',
    record: regulationTypeData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} regulationTypeId 
 * @param {Object} regulationTypeData 
 */
export const updateRegulationType = (regulationTypeId, regulationTypeData) => {
  if (!regulationTypeId) {
    return Promise.reject(new Error("ID jenis regulasi tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'jenis-regulasi',
    key: regulationTypeId,
    record: regulationTypeData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} regulationTypeId
 */
export const deleteRegulationType = (regulationTypeId) => {
  if (!regulationTypeId) {
    return Promise.reject(new Error("ID jenis regulasi tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'jenis-regulasi',
      key: regulationTypeId,
    },
  });
};