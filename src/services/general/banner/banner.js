import apiClient from '../../users';

/**
 * Mengambil daftar banner.
 * @param {Object} params 
 */
export const getBanner = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'banner',
      ...params,
    },
  });

/**
 * Mengambil detail satu banner berdasarkan ID-nya.
 * @param {string|number} bannerId 
 */
export const getDetailBanner = (bannerId) => {
  if (!bannerId) {
    return Promise.reject(new Error("ID banner tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'banner',
      key: bannerId,
    },
  });
};

/**
 * Menambah banner baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addBanner = (formData) => {
  formData.append('act', 'banner');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data banner yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} bannerId 
 * @param {FormData} formData 
 */
export const updateBanner = (bannerId, formData) => {
  if (!bannerId) {
    return Promise.reject(new Error("ID banner tidak tersedia."));
  }
  formData.append('act', 'banner');
  formData.append('key', bannerId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data banner berdasarkan ID-nya.
 * @param {string|number} bannerId
 */
export const deleteBanner = (bannerId) => {
  if (!bannerId) {
    return Promise.reject(new Error("ID banner tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'banner',
      key: bannerId,
    },
  });
};