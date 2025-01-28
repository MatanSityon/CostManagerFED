const idb = (function () {
    let dbInstance = null;

    function openCostsDB(dbName, version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            request.onupgradeneeded = function (event) {
                const db = event.target.result;

                if (!db.objectStoreNames.contains("costs")) {
                    db.createObjectStore("costs", { keyPath: "id", autoIncrement: true });
                }
            };

            request.onsuccess = function (event) {
                dbInstance = event.target.result;
                resolve(idb);
            };

            request.onerror = function (event) {
                reject(new Error("Failed to open IndexedDB: " + event.target.error));
            };
        });
    }

    function addCost(costItem) {
        return new Promise((resolve, reject) => {
            if (!dbInstance) {
                return reject(new Error("Database is not initialized. Call openCostsDB() first."));
            }

            const transaction = dbInstance.transaction(["costs"], "readwrite");
            const store = transaction.objectStore("costs");
            const request = store.add(costItem);

            request.onsuccess = function () {
                resolve(true);
            };

            request.onerror = function (event) {
                reject(new Error("Failed to add cost: " + event.target.error));
            };
        });
    }

    return {
        openCostsDB,
        addCost,
    };
})();
