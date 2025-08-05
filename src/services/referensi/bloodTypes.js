import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getBloodTypes = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'golongan-darah',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} bloodTypeId
 */
export const getDetailBloodType = (bloodTypeId) => {
  if (!bloodTypeId) {
    return Promise.reject(new Error("ID golongan darah tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'golongan-darah',
      key: bloodTypeId,
    },
  });
};

/**
 * Membuat/menambah region baru.
 * @param {Object} bloodTypeData 
 */
export const addBloodType = (bloodTypeData) =>
  apiClient.post('', {
    act: 'golongan-darah',
    record: bloodTypeData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} bloodTypeId 
 * @param {Object} bloodTypeData 
 */
export const updateBloodType = (bloodTypeId, bloodTypeData) => {
  if (!bloodTypeId) {
    return Promise.reject(new Error("ID golongan darah tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'golongan-darah',
    key: bloodTypeId,
    record: bloodTypeData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} bloodTypeId
 */
export const deleteBloodType = (bloodTypeId) => {
  if (!bloodTypeId) {
    return Promise.reject(new Error("ID golongan darah tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'golongan-darah',
      key: bloodTypeId,
    },
  });
};