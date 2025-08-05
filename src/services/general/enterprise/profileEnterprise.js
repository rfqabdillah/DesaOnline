import apiClient from '../../users';

/**
 * Mengambil daftar badan usaha.
 * @param {Object} params 
 */
export const getProfileEnterprises = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'badan-usaha',
      ...params,
    },
  });

/**
 * Mengambil detail satu badan usaha berdasarkan ID-nya.
 * @param {string|number} profileEnterpriseId 
 */
export const getDetailProfileEnterprise = (profileEnterpriseId) => {
  if (!profileEnterpriseId) {
    return Promise.reject(new Error("ID badan usaha tidak tersedia"));
  }
  return apiClient.get('', {
    params: {
      act: 'badan-usaha',
      key: profileEnterpriseId,
    },
  });
};

/**
 * Menambah badan usaha baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addProfileEnterprise = (formData) => {
  formData.append('act', 'badan-usaha');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data badan usaha yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} profileEnterpriseId 
 * @param {FormData} formData 
 */
export const updateProfileEnterprise = (profileEnterpriseId, formData) => {
  if (!profileEnterpriseId) {
    return Promise.reject(new Error("ID badan usaha tidak tersedia"));
  }
  formData.append('act', 'badan-usaha');
  formData.append('key', profileEnterpriseId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data badan usaha berdasarkan ID-nya.
 * @param {string|number} profileEnterpriseId
 */
export const deleteProfileEnterprise = (profileEnterpriseId) => {
  if (!profileEnterpriseId) {
    return Promise.reject(new Error("ID badan usaha tidak tersedia"));
  }
  return apiClient.delete('', {
    data: {
      act: 'badan-usaha',
      key: profileEnterpriseId,
    },
  });
};