import apiClient from '../../users';

/**
 * Mengambil daftar laporan usaha.
 * @param {Object} params 
 */
export const getReports = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'laporan-usaha',
      ...params,
    },
  });

/**
 * Mengambil detail satu laporan usaha berdasarkan ID-nya.
 * @param {string|number} reportId 
 */
export const getDetailReport = (reportId) => {
  if (!reportId) {
    return Promise.reject(new Error("ID laporan usaha tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'laporan-usaha',
      key: reportId,
    },
  });
};

/**
 * Menambah laporan usaha baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addReport = (formData) => {
  formData.append('act', 'laporan-usaha');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data laporan usaha yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} reportId 
 * @param {FormData} formData 
 */
export const updateReport = (reportId, formData) => {
  if (!reportId) {
    return Promise.reject(new Error("ID laporan usaha tidak tersedia."));
  }
  formData.append('act', 'laporan-usaha');
  formData.append('key', reportId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data laporan usaha berdasarkan ID-nya.
 * @param {string|number} reportId
 */
export const deleteReport = (reportId) => {
  if (!reportId) {
    return Promise.reject(new Error("ID laporan usaha tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'laporan-usaha',
      key: reportId,
    },
  });
};