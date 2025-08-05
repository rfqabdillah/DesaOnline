import apiClient from '../../users';

/**
 * Mengambil daftar dusun.
 * @param {Object} params 
 */
export const getDusuns = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'dusun',
      ...params,
    },
  });

/**
 * Mengambil detail satu dusun berdasarkan ID-nya.
 * @param {string|number} dusunId 
 */
export const getDetailDusun = (dusunId) => {
  if (!dusunId) {
    return Promise.reject(new Error("ID dusun tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'dusun',
      key: dusunId,
    },
  });
};

/**
 * Menambah dusun baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addDusun = (formData) => {
  formData.append('act', 'dusun');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data dusun yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} dusunId 
 * @param {FormData} formData 
 */
export const updateDusun = (dusunId, formData) => {
  if (!dusunId) {
    return Promise.reject(new Error("ID dusun tidak tersedia."));
  }
  formData.append('act', 'dusun');
  formData.append('key', dusunId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data dusun berdasarkan ID-nya.
 * @param {string|number} dusunId
 */
export const deleteDusun = (dusunId) => {
  if (!dusunId) {
    return Promise.reject(new Error("ID dusun tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'dusun',
      key: dusunId,
    },
  });
};