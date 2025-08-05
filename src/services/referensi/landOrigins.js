import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getLandOrigins = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'asal-usul-tanah',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} landOriginId
 */
export const getDetailLandOrigin = (landOriginId) => {
  if (!landOriginId) {
    return Promise.reject(new Error("ID asal usul tanah tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'asal-usul-tanah',
      key: landOriginId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} landOriginData 
 */
export const addLandOrigin = (landOriginData) =>
  apiClient.post('', {
    act: 'asal-usul-tanah',
    record: landOriginData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} landOriginId 
 * @param {Object} landOriginData 
 */
export const updateLandOrigin = (landOriginId, landOriginData) => {
  if (!landOriginId) {
    return Promise.reject(new Error("ID asal usul tanah tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'asal-usul-tanah',
    key: landOriginId,
    record: landOriginData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} landOriginId
 */
export const deleteLandOrigin = (landOriginId) => {
  if (!landOriginId) {
    return Promise.reject(new Error("ID asal usul tanah tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'asal-usul-tanah',
      key: landOriginId,
    },
  });
};