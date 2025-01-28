/**
 * A wrapper class for managing IndexedDB operations.
 */
class IDBWrapper {
    /**
     * Initializes an IndexedDB instance.
     * @param {string} dbName - The name of the database.
     * @param {number} version - The database version.
     */
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null; // Will store the database instance after opening
    }

    /**
     * Opens the IndexedDB database and creates object stores if necessary.
     * @param {Array<{name: string, options?: IDBObjectStoreParameters}>} objectStores - Object stores to be created.
     * @returns {Promise<IDBDatabase>} - Resolves with the opened database instance.
     */
    async openDB(objectStores) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;

                // Create object stores if they do not exist
                for (const store of objectStores) {
                    if (!this.db.objectStoreNames.contains(store.name)) {
                        this.db.createObjectStore(store.name, store.options || { keyPath: "id", autoIncrement: true });
                    }
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject(new Error(`Failed to open database: ${event.target.error}`));
            };
        });
    }

    /**
     * Adds an item to the specified object store.
     * @param {string} storeName - The name of the object store.
     * @param {Object} item - The item to be added.
     * @returns {Promise<number>} - Resolves with the added item's ID.
     */
    async addItem(storeName, item) {
        if (!this.db) {
            throw new Error("Database is not initialized. Call openDB() first.");
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.add(item);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * Retrieves all items from the specified object store.
     * @param {string} storeName - The name of the object store.
     * @returns {Promise<Array>} - Resolves with an array of stored items.
     */
    async getItems(storeName) {
        if (!this.db) {
            throw new Error("Database is not initialized. Call openDB() first.");
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * Retrieves items from the specified store based on a filter function.
     * @param {string} storeName - The name of the object store.
     * @param {Function} filterCallback - Function that filters the stored items.
     * @returns {Promise<Array>} - Resolves with an array of filtered items.
     */
    async getItemsByFilter(storeName, filterCallback) {
        if (!this.db) {
            throw new Error("Database is not initialized. Call openDB() first.");
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.openCursor();
            const results = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    // Apply filter function to each item
                    if (filterCallback(cursor.value)) {
                        results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * Deletes an item from the specified object store.
     * @param {string} storeName - The name of the object store.
     * @param {number} key - The unique key of the item to delete.
     * @returns {Promise<void>} - Resolves when the item is deleted.
     */
    async deleteItem(storeName, key) {
        if (!this.db) {
            throw new Error("Database is not initialized. Call openDB() first.");
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * Updates an existing item in the object store.
     * @param {string} storeName - The name of the object store.
     * @param {number} key - The unique key of the item to update.
     * @param {Object} updatedItem - The updated item data.
     * @returns {Promise<Object>} - Resolves with the updated item.
     */
    async updateItem(storeName, key, updatedItem) {
        if (!this.db) {
            throw new Error("Database is not initialized. Call openDB() first.");
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = (event) => {
                const existingItem = event.target.result;

                if (existingItem) {
                    // Merge existing item with updated fields
                    const updatedData = { ...existingItem, ...updatedItem };
                    const updateRequest = store.put(updatedData);

                    updateRequest.onsuccess = () => resolve(updatedData);
                    updateRequest.onerror = (err) => reject(new Error(`Failed to update item: ${err.target.error}`));
                } else {
                    reject(new Error("Item not found in the database."));
                }
            };

            request.onerror = (err) => reject(new Error(`Failed to fetch item: ${err.target.error}`));
        });
    }
}

export default IDBWrapper;