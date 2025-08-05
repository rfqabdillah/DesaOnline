import apiClient from '../../users';

/**
 * Mengambil daftar dokumen.
 * @param {Object} params 
 */
export const getDocuments = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'dokumen',
      ...params,
    },
  });

/**
 * Mengambil detail satu dokumen berdasarkan ID-nya.
 * @param {string|number} documentId 
 */
export const getDetailDocument = (documentId) => {
  if (!documentId) {
    return Promise.reject(new Error("ID dokumen tidak tersedia"));
  }
  return apiClient.get('', {
    params: {
      act: 'dokumen',
      key: documentId,
    },
  });
};

/**
 * Menambah dokumen baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addDocument = (formData) => {
  formData.append('act', 'dokumen');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data dokumen yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} documentId 
 * @param {FormData} formData 
 */
export const updateDocument = (documentId, formData) => {
  if (!documentId) {
    return Promise.reject(new Error("ID dokumen tidak tersedia"));
  }
  formData.append('act', 'dokumen');
  formData.append('key', documentId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data dokumen berdasarkan ID-nya.
 * @param {string|number} documentId
 */
export const deleteDocument = (documentId) => {
  if (!documentId) {
    return Promise.reject(new Error("ID dokumen tidak tersedia"));
  }
  return apiClient.delete('', {
    data: {
      act: 'dokumen',
      key: documentId,
    },
  });
};