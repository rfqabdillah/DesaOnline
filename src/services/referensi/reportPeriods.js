import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getReportPeriods = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'periode-laporan-usaha',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} reportPeriodId
 */
export const getDetailReportPeriod = (reportPeriodId) => {
  if (!reportPeriodId) {
    return Promise.reject(new Error("ID periode laporan usaha tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'periode-laporan-usaha',
      key: reportPeriodId,
    },
  });
};

/**
 * Membuat/menambah region baru.
 * @param {Object} reportPeriodData 
 */
export const addReportPeriod = (reportPeriodData) =>
  apiClient.post('', {
    act: 'periode-laporan-usaha',
    record: reportPeriodData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} reportPeriodId 
 * @param {Object} reportPeriodData 
 */
export const updateReportPeriod = (reportPeriodId, reportPeriodData) => {
  if (!reportPeriodId) {
    return Promise.reject(new Error("ID periode laporan usaha tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'periode-laporan-usaha',
    key: reportPeriodId,
    record: reportPeriodData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} reportPeriodId
 */
export const deleteReportPeriod = (reportPeriodId) => {
  if (!reportPeriodId) {
    return Promise.reject(new Error("ID periode laporan usaha tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'periode-laporan-usaha',
      key: reportPeriodId,
    },
  });
};