import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getBirthPlaces = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'tempat-dilahirkan',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} birthPlaceId
 */
export const getDetailBirthPlace = (birthPlaceId) => {
  if (!birthPlaceId) {
    return Promise.reject(new Error("ID tempat dilahirkan tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'tempat-dilahirkan',
      key: birthPlaceId,
    },
  });
};

/**
 * Membuat/menambah region baru.
 * @param {Object} birthPlaceData 
 */
export const addBirthPlace = (birthPlaceData) =>
  apiClient.post('', {
    act: 'tempat-dilahirkan',
    record: birthPlaceData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} birthPlaceId 
 * @param {Object} birthPlaceData 
 */
export const updateBirthPlace = (birthPlaceId, birthPlaceData) => {
  if (!birthPlaceId) {
    return Promise.reject(new Error("ID tempat dilahirkan tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'tempat-dilahirkan',
    key: birthPlaceId,
    record: birthPlaceData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} birthPlaceId
 */
export const deleteBirthPlace = (birthPlaceId) => {
  if (!birthPlaceId) {
    return Promise.reject(new Error("ID tempat dilahirkan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'tempat-dilahirkan',
      key: birthPlaceId,
    },
  });
};