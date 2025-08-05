import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getFamilyRelationships = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'hubungan-keluarga',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} familyRelationshipId
 */
export const getDetailFamilyRelationship = (familyRelationshipId) => {
  if (!familyRelationshipId) {
    return Promise.reject(new Error("ID hubungan keluarga tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'hubungan-keluarga',
      key: familyRelationshipId,
    },
  });
};

/**
 * Membuat/menambah baru.
 * @param {Object} familyRelationshipData 
 */
export const addFamilyRelationship = (familyRelationshipData) =>
  apiClient.post('', {
    act: 'hubungan-keluarga',
    record: familyRelationshipData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} familyRelationshipId 
 * @param {Object} familyRelationshipData 
 */
export const updateFamilyRelationship = (familyRelationshipId, familyRelationshipData) => {
  if (!familyRelationshipId) {
    return Promise.reject(new Error("ID hubungan keluarga tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'hubungan-keluarga',
    key: familyRelationshipId,
    record: familyRelationshipData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} familyRelationshipId
 */
export const deleteFamilyRelationship = (familyRelationshipId) => {
  if (!familyRelationshipId) {
    return Promise.reject(new Error("ID hubungan keluarga tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'hubungan-keluarga',
      key: familyRelationshipId,
    },
  });
};