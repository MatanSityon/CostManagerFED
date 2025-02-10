/**
 * A simple IndexedDB wrapper for managing cost data.
 * This module provides methods to open the database and add cost items.
 */
const idb = (function () {
    let dbInstance = null; // Stores the opened IndexedDB instance

    /**
     * Opens an IndexedDB database for storing cost data.
     * @param {string} dbName - The name of the IndexedDB database.
     * @param {number} version - The version number of the database.
     * @returns {Promise<Object>} - Resolves with the `idb` object upon successful opening.
     */
    function openCostsDB(dbName, version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            /**
             * Runs if the database is being created or upgraded.
             * This is where object stores are created.
             */
            request.onupgradeneeded = function (event) {
                const db = event.target.result;

                // Create an object store named "costs" if it doesn't already exist.
                if (!db.objectStoreNames.contains("costs")) {
                    db.createObjectStore("costs", { keyPath: "id", autoIncrement: true });
                }
            };

            /**
             * Runs when the database is successfully opened.
             */
            request.onsuccess = function (event) {
                dbInstance = event.target.result; // Store the database instance
                resolve(idb); // Resolve the promise with the module itself
            };

            /**
             * Runs if there is an error opening the database.
             */
            request.onerror = function (event) {
                reject(new Error("Failed to open IndexedDB: " + event.target.error));
            };
        });
    }

    /**
     * Adds a cost item to the "costs" object store in IndexedDB.
     * @param {Object} costItem - The cost item object to be added.
     * @param {number} costItem.id - Unique ID of the cost (auto-generated).
     * @param {string} costItem.category - Category of the cost.
     * @param {number} costItem.amount - Amount of the expense.
     * @param {string} costItem.description - Description of the expense.
     * @param {string} costItem.date - Date of the expense in YYYY-MM-DD format.
     * @returns {Promise<boolean>} - Resolves `true` if successfully added.
     */
    function addCost(costItem) {
        return new Promise((resolve, reject) => {
            // Ensure the database is initialized before attempting to add data
            if (!dbInstance) {
                return reject(new Error("Database is not initialized. Call openCostsDB() first."));
            }

            // Create a transaction for read/write operations
            const transaction = dbInstance.transaction(["costs"], "readwrite");
            const store = transaction.objectStore("costs");
            const request = store.add(costItem); // Add the cost item to the store

            /**
             * Runs when the item is successfully added.
             */
            request.onsuccess = function () {
                resolve(true);
            };

            /**
             * Runs if there is an error adding the item.
             */
            request.onerror = function (event) {
                reject(new Error("Failed to add cost: " + event.target.error));
            };
        });
    }

    // Expose the public API of the `idb` module
    return {
        openCostsDB,
        addCost,
    };
})();