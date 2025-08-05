import apiClient from '../users'; 

/**
 * Mengambil daftar religion
 * @param {Object} params 
 */

export const getReligions = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'agama',
      ...params,
    },
  });

/**
 * Mengambil detail satu religion berdasarkan ID-nya.
 * @param {string|number} religionId 
 */
export const getDetailReligion = (religionId) => {
  if (!religionId) {
    return Promise.reject(new Error("ID agama tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'agama',
      key: religionId,
    },
  });
};

/**
 * Membuat/menambah religion baru.
 * @param {Object} religionData 
 */
export const addReligion = (religionData) =>
  apiClient.post('', {
    act: 'agama',
    record: religionData,
  });

/**
 * Memperbarui religion yang ada berdasarkan ID-nya.
 * @param {string|number} religionId
 * @param {Object} religionData
 */
export const updateReligion = (religionId, religionData) => {
  if (!religionId) {
    return Promise.reject(new Error("ID agama tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'agama',
    key: religionId,
    record: religionData,
  });
};

/**
 * Menghapus religion berdasarkan ID-nya.
 * @param {string|number} religionId
 */
export const deleteReligion = (religionId) => {
  if (!religionId) {
    return Promise.reject(new Error("ID agama tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'agama',
      key: religionId,
    },
  });
};