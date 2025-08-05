import apiClient from '../../users';

/**
 * Mengambil daftar profil desa.
 * @param {Object} params 
 */
export const getProfiles = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'profil-desa',
      ...params,
    },
  });

/**
 * Mengambil detail satu profil desa berdasarkan ID-nya.
 * @param {string|number} profileId 
 */
export const getDetailProfile = (profileId) => {
  if (!profileId) {
    return Promise.reject(new Error("ID profil desa tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'profil-desa',
      key: profileId,
    },
  });
};

/**
 * Menambah profil desa baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addProfile = (formData) => {
  formData.append('act', 'profil-desa');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data profil desa yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} profileId 
 * @param {FormData} formData 
 */
export const updateProfile = (profileId, formData) => {
  if (!profileId) {
    return Promise.reject(new Error("ID profil desa tidak tersedia."));
  }
  formData.append('act', 'profil-desa');
  formData.append('key', profileId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data profil desa berdasarkan ID-nya.
 * @param {string|number} profileId
 */
export const deleteProfile = (profileId) => {
  if (!profileId) {
    return Promise.reject(new Error("ID profil desa tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'profil-desa',
      key: profileId,
    },
  });
};