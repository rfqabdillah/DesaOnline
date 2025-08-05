import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getConcreteConstructions = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'konstruksi-beton',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} concreteConstructionId
 */
export const getDetailConcreteConstruction = (concreteConstructionId) => {
  if (!concreteConstructionId) {
    return Promise.reject(new Error("ID konstruksi beton tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'konstruksi-beton',
      key: concreteConstructionId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} concreteConstructionData 
 */
export const addConcreteConstruction = (concreteConstructionData) =>
  apiClient.post('', {
    act: 'konstruksi-beton',
    record: concreteConstructionData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} concreteConstructionId 
 * @param {Object} concreteConstructionData 
 */
export const updateConcreteConstruction = (concreteConstructionId, concreteConstructionData) => {
  if (!concreteConstructionId) {
    return Promise.reject(new Error("ID konstruksi beton tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'konstruksi-beton',
    key: concreteConstructionId,
    record: concreteConstructionData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} concreteConstructionId
 */
export const deleteConcreteConstruction = (concreteConstructionId) => {
  if (!concreteConstructionId) {
    return Promise.reject(new Error("ID konstruksi beton tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'konstruksi-beton',
      key: concreteConstructionId,
    },
  });
};