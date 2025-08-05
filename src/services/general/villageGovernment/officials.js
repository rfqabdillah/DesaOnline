import apiClient from '../../users';

/**
 * Mengambil daftar perangkat.
 * @param {Object} params 
 */
export const getOfficials = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'perangkat',
      ...params,
    },
  });

/**
 * Mengambil detail satu perangkat berdasarkan ID-nya.
 * @param {string|number} officialId 
 */
export const getDetailOfficial = (officialId) => {
  if (!officialId) {
    return Promise.reject(new Error("ID perangkat tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'perangkat',
      key: officialId,
    },
  });
};

/**
 * Menambah perangkat baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addOfficial = (formData) => {
  formData.append('act', 'perangkat');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data perangkat yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} officialId 
 * @param {FormData} formData 
 */
export const updateOfficial = (officialId, formData) => {
  if (!officialId) {
    return Promise.reject(new Error("ID perangkat tidak tersedia."));
  }
  formData.append('act', 'perangkat');
  formData.append('key', officialId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data perangkat berdasarkan ID-nya.
 * @param {string|number} officialId
 */
export const deleteOfficial = (officialId) => {
  if (!officialId) {
    return Promise.reject(new Error("ID perangkat tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'perangkat',
      key: officialId,
    },
  });
};