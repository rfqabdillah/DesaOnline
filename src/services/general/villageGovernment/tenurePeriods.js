import apiClient from '../../users';

/**
 * Mengambil daftar periode jabatan.
 * @param {Object} params 
 */
export const getPeriods = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'periode-perangkat',
      ...params,
    },
  });

/**
 * Mengambil detail satu periode jabatan berdasarkan ID-nya.
 * @param {string|number} periodId 
 */
export const getDetailPeriod = (periodId) => {
  if (!periodId) {
    return Promise.reject(new Error("ID periode jabatan tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'periode-perangkat',
      key: periodId,
    },
  });
};

/**
 * Menambah periode jabatan baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addPeriod = (formData) => {
  formData.append('act', 'periode-perangkat');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data periode jabatan yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} periodId 
 * @param {FormData} formData 
 */
export const updatePeriod = (periodId, formData) => {
  if (!periodId) {
    return Promise.reject(new Error("ID periode jabatan tidak tersedia."));
  }
  formData.append('act', 'periode-perangkat');
  formData.append('key', periodId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data periode jabatan berdasarkan ID-nya.
 * @param {string|number} periodId
 */
export const deletePeriod = (periodId) => {
  if (!periodId) {
    return Promise.reject(new Error("ID periode jabatan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'periode-perangkat',
      key: periodId,
    },
  });
};