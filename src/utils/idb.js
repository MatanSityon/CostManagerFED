class IDBWrapper {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    async openDB(objectStores) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
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
