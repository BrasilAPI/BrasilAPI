/**
 * Rejects the promise if the data is an empty array.
 *
 * @param {Promise} promise
 * @returns {Promise}
 */
export async function rejectWhenEmptyArray(promise) {
  const data = await promise;
  if (!data || data.length === 0) {
    throw new Error('Empty data');
  }
  return data;
}
