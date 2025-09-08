import apiClient from '../../users';

/**
 * Mengambil daftar tanah.
 * @param {Object} params 
 */
export const getLands = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'tanah',
      ...params,
    },
  });

/**
 * Mengambil detail satu tanah berdasarkan ID-nya.
 * @param {string|number} landId 
 */
export const getDetailLand = (landId) => {
  if (!landId) {
    return Promise.reject(new Error("ID tanah tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'tanah',
      key: landId,
    },
  });
};

/**
 * Menambah tanah baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addLand = (formData) => {
  formData.append('act', 'tanah');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data tanah yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} landId 
 * @param {FormData} formData 
 */
export const updateLand = (landId, formData) => {
  if (!landId) {
    return Promise.reject(new Error("ID tanah tidak tersedia."));
  }
  formData.append('act', 'tanah');
  formData.append('key', landId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data tanah berdasarkan ID-nya.
 * @param {string|number} landId
 */
export const deleteLand = (landId) => {
  if (!landId) {
    return Promise.reject(new Error("ID tanah tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'tanah',
      key: landId,
    },
  });
};