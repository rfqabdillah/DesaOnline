import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getBudgetSources = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'sumber-anggaran',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} budgetSourceId
 */
export const getDetailBudgetSource = (budgetSourceId) => {
  if (!budgetSourceId) {
    return Promise.reject(new Error("ID sumber anggaran tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'sumber-anggaran',
      key: budgetSourceId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} budgetSourceData 
 */
export const addBudgetSource = (budgetSourceData) =>
  apiClient.post('', {
    act: 'sumber-anggaran',
    record: budgetSourceData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} budgetSourceId 
 * @param {Object} budgetSourceData 
 */
export const updateBudgetSource = (budgetSourceId, budgetSourceData) => {
  if (!budgetSourceId) {
    return Promise.reject(new Error("ID sumber anggaran tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'sumber-anggaran',
    key: budgetSourceId,
    record: budgetSourceData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} budgetSourceId
 */
export const deleteBudgetSource = (budgetSourceId) => {
  if (!budgetSourceId) {
    return Promise.reject(new Error("ID sumber anggaran tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'sumber-anggaran',
      key: budgetSourceId,
    },
  });
};