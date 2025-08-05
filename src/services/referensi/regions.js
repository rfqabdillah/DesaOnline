import apiClient from '../users'; 

/**
 * Mengambil daftar region
 * @param {Object} params 
 */

export const getRegions = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'regions',
      ...params,
    },
  });

/**
 * Mengambil detail satu region berdasarkan ID-nya.
 * @param {string|number} regionId 
 */
export const getDetailRegion = (regionId) => {
  if (!regionId) {
    return Promise.reject(new Error("ID Region tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'regions',
      key: regionId,
    },
  });
};

/**
 * Membuat/menambah region baru.
 * @param {Object} regionData 
 */
export const addRegion = (regionData) =>
  apiClient.post('', {
    act: 'regions',
    record: regionData,
  });

/**
 * Memperbarui region yang ada berdasarkan ID-nya.
 * @param {string|number} regionId 
 * @param {Object} regionData 
 */
export const updateRegion = (regionId, regionData) => {
  if (!regionId) {
    return Promise.reject(new Error("ID Region tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'regions',
    key: regionId,
    record: regionData,
  });
};

/**
 * Menghapus region berdasarkan ID-nya.
 * @param {string|number} regionId
 */
export const deleteRegion = (regionId) => {
  if (!regionId) {
    return Promise.reject(new Error("ID Region tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'regions',
      key: regionId,
    },
  });
};