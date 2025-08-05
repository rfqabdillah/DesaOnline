import apiClient from '../../users';

/**
 * Mengambil daftar link terkait.
 * @param {Object} params 
 */
export const getRelatedLinks = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'link-terkait',
      ...params,
    },
  });

/**
 * Mengambil detail satu link terkait berdasarkan ID-nya.
 * @param {string|number} relatedLinkId 
 */
export const getDetailRelatedLink = (relatedLinkId) => {
  if (!relatedLinkId) {
    return Promise.reject(new Error("ID link terkait tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'link-terkait',
      key: relatedLinkId,
    },
  });
};

/**
 * Menambah link terkait baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addRelatedLink = (formData) => {
  formData.append('act', 'link-terkait');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data link terkait yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} relatedLinkId 
 * @param {FormData} formData 
 */
export const updateRelatedLink = (relatedLinkId, formData) => {
  if (!relatedLinkId) {
    return Promise.reject(new Error("ID link terkait tidak tersedia."));
  }
  formData.append('act', 'link-terkait');
  formData.append('key', relatedLinkId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data link terkait berdasarkan ID-nya.
 * @param {string|number} relatedLinkId
 */
export const deleteRelatedLink = (relatedLinkId) => {
  if (!relatedLinkId) {
    return Promise.reject(new Error("ID link terkait tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'link-terkait',
      key: relatedLinkId,
    },
  });
};