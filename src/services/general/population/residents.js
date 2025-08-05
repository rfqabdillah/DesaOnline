import apiClient from '../../users';

/**
 * Mengambil daftar penduduk.
 * @param {Object} params 
 */
export const getResidents = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'penduduk',
      ...params,
    },
  });

/**
 * Mengambil detail satu penduduk berdasarkan ID-nya.
 * @param {string|number} residentId 
 */
export const getDetailResident = (residentId) => {
  if (!residentId) {
    return Promise.reject(new Error("ID penduduk tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'penduduk',
      key: residentId,
    },
  });
};

/**
 * Menambah penduduk baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addResident = (formData) => {
  formData.append('act', 'penduduk');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data penduduk yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} residentId 
 * @param {FormData} formData 
 */
export const updateResident = (residentId, formData) => {
  if (!residentId) {
    return Promise.reject(new Error("ID penduduk tidak tersedia."));
  }
  formData.append('act', 'penduduk');
  formData.append('key', residentId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data penduduk berdasarkan ID-nya.
 * @param {string|number} residentId
 */
export const deleteResident = (residentId) => {
  if (!residentId) {
    return Promise.reject(new Error("ID penduduk tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'penduduk',
      key: residentId,
    },
  });
};