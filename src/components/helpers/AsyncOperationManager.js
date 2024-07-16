/**
 * AsyncOperationManager
 * a utility class to ensure promise resolution is shared across multiple calls
 *
 * use like this:
 * ```js
 * const asyncOperationManager = new AsyncOperationManager();
 * let types = null; // fetched data cache
 * const getTypes = async() => {
 *     return await asyncOperationManager.execute('types', async() => {
 *         if (types===null) {
 *             const response = await fetch(API_ENDPOINT + 'types');
 *             types = await response.json(); // cache the data
 *         }
 *         return types; // return the cached data
 *     }
 * }
 * ```
 * in this example no matter how many times getTypes is called concurrently there will only ever be a single fetch
 * operations and 'types' will be returned for all callers
 *
 * please note that the operation key ('types' in the example) should be unique across across your application
 */
export class AsyncOperationManager {

    constructor() {
        this.ongoingOperations = new Map();
    }

    async execute(operationKey, operation) {
        if (this.ongoingOperations.has(operationKey)) {
            return await this.ongoingOperations.get(operationKey);
        }
        const operationPromise = (async ()=> {
            try {
                return await operation();
            }
            finally {
                this.ongoingOperations.delete(operationKey);
            }
        })();
        this.ongoingOperations.set(operationKey, operationPromise);
        return await operationPromise;
    }
}