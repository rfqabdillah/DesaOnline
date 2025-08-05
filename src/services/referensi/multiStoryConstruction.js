import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getMultiStoryConstructions = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'konstruksi-bertingkat',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} multiStoryConstructionId
 */
export const getDetailMultiStoryConstruction = (multiStoryConstructionId) => {
  if (!multiStoryConstructionId) {
    return Promise.reject(new Error("ID kontruksi bertingkat tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'konstruksi-bertingkat',
      key: multiStoryConstructionId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} multiStoryConstructionData 
 */
export const addMultiStoryConstruction = (multiStoryConstructionData) =>
  apiClient.post('', {
    act: 'konstruksi-bertingkat',
    record: multiStoryConstructionData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} multiStoryConstructionId 
 * @param {Object} multiStoryConstructionData 
 */
export const updateMultiStoryConstruction = (multiStoryConstructionId, multiStoryConstructionData) => {
  if (!multiStoryConstructionId) {
    return Promise.reject(new Error("ID kontruksi bertingkat tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'konstruksi-bertingkat',
    key: multiStoryConstructionId,
    record: multiStoryConstructionData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} multiStoryConstructionId
 */
export const deleteMultiStoryConstruction = (multiStoryConstructionId) => {
  if (!multiStoryConstructionId) {
    return Promise.reject(new Error("ID kontruksi bertingkat tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'konstruksi-bertingkat',
      key: multiStoryConstructionId,
    },
  });
};