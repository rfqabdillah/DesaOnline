import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getAcquisitionProcedures = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'prosedur-penguasaan',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} acquisitionProcedureId
 */
export const getDetailAcquisitionProcedure = (acquisitionProcedureId) => {
  if (!acquisitionProcedureId) {
    return Promise.reject(new Error("ID prosedur penguasaan tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'prosedur-penguasaan',
      key: acquisitionProcedureId,
    },
  });
};

/**
 * Membuat/menambah data baru.
 * @param {Object} acquisitionProcedureData 
 */
export const addAcquisitionProcedure = (acquisitionProcedureData) =>
  apiClient.post('', {
    act: 'prosedur-penguasaan',
    record: acquisitionProcedureData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} acquisitionProcedureId 
 * @param {Object} acquisitionProcedureData 
 */
export const updateAcquisitionProcedure = (acquisitionProcedureId, acquisitionProcedureData) => {
  if (!acquisitionProcedureId) {
    return Promise.reject(new Error("ID prosedur penguasaan tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'prosedur-penguasaan',
    key: acquisitionProcedureId,
    record: acquisitionProcedureData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} acquisitionProcedureId
 */
export const deleteAcquisitionProcedure = (acquisitionProcedureId) => {
  if (!acquisitionProcedureId) {
    return Promise.reject(new Error("ID prosedur penguasaan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'prosedur-penguasaan',
      key: acquisitionProcedureId,
    },
  });
};