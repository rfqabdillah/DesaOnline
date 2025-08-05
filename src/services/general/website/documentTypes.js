import apiClient from '../../users';

/**
 * Mengambil daftar jenis dokumen.
 * @param {Object} params 
 */
export const getDocumentTypes = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'jenis-dokumen',
      ...params,
    },
  });

/**
 * Mengambil detail satu jenis dokumen berdasarkan ID-nya.
 * @param {string|number} documentTypeId 
 */
export const getDetailDocumentType = (documentTypeId) => {
  if (!documentTypeId) {
    return Promise.reject(new Error("ID jenis dokumen tidak tersedia"));
  }
  return apiClient.get('', {
    params: {
      act: 'jenis-dokumen',
      key: documentTypeId,
    },
  });
};

/**
 * Menambah jenis dokumen baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addDocumentType = (formData) => {
  formData.append('act', 'jenis-dokumen');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data jenis dokumen yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} documentTypeId 
 * @param {FormData} formData 
 */
export const updateDocumentType = (documentTypeId, formData) => {
  if (!documentTypeId) {
    return Promise.reject(new Error("ID jenis dokumen tidak tersedia"));
  }
  formData.append('act', 'jenis-dokumen');
  formData.append('key', documentTypeId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data jenis dokumen berdasarkan ID-nya.
 * @param {string|number} documentTypeId
 */
export const deleteDocumentType = (documentTypeId) => {
  if (!documentTypeId) {
    return Promise.reject(new Error("ID jenis dokumen tidak tersedia"));
  }
  return apiClient.delete('', {
    data: {
      act: 'jenis-dokumen',
      key: documentTypeId,
    },
  });
};