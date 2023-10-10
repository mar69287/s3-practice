import sendRequest from './send-request'
const BASE_URL = '/api/images'

export async function createImage(formData) {
    return sendRequest(`${BASE_URL}`, 'POST', formData, {
      'Content-Type': 'multipart/form-data', // Make sure to set the correct content type
    });
}