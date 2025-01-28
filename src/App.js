import React, { useState, useEffect } from "react";
import AddCostItemForm from "./components/AddCostItemForm";
import ReportTable from "./components/ReportTable";
import PieChart from "./components/PieChart";
import IDBWrapper from "./utils/idb";
import { Container, Typography, Box, Paper } from "@mui/material";

/**
 * Main application component that manages state, user interactions, and IndexedDB.
 */
const App = () => {
    const [idb, setIdb] = useState(null); // Holds the IndexedDB instance
    const [reportData, setReportData] = useState([]); // Stores report table data
    const [chartData, setChartData] = useState(null); // Stores data for the pie chart

    // useEffect runs once on mount to initialize the database
    useEffect(() => {
        const initializeDB = async () => {
            try {
                const idbInstance = new IDBWrapper("CostManagerDB", 1);
                await idbInstance.openDB([
                    { name: "costItems", options: { keyPath: "id", autoIncrement: true } },
                ]);
                setIdb(idbInstance); // Store the initialized IndexedDB instance in state
            } catch (error) {
                console.error("Failed to initialize database:", error);
            }
        };

        initializeDB();
    }, []);

    /**
     * Generates a financial report for a given month and year.
     * @param {string} month - Selected month (1-12).
     * @param {string} year - Selected year.
     */
    const generateReport = async (month, year) => {
        if (!idb) return;

        try {
            // Retrieve all items that match the selected month and year
            const items = await idb.getItemsByFilter("costItems", (item) => {
                const itemDate = new Date(item.date);
                return (
                    itemDate.getMonth() + 1 === parseInt(month) &&
                    itemDate.getFullYear() === parseInt(year)
                );
            });

            setReportData(items); // Update report table data

            // Calculate total expenses per category
            const categoryTotals = items.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + item.price;
                return acc;
            }, {});

            // Prepare data for pie chart visualization
            setChartData({
                labels: Object.keys(categoryTotals),
                datasets: [
                    {
                        data: Object.values(categoryTotals),
                        backgroundColor: [
                            "#FF6384", // Red
                            "#36A2EB", // Blue
                            "#FFCE56", // Yellow
                            "#4BC0C0", // Teal
                            "#9966FF", // Purple
                            "#FF9F40", // Orange
                            "#8D6E63", // Brown
                            "#00C853", // Green
                            "#607D8B", // Grey-Blue
                            "#D81B60"  // Pink
                        ]                    },
                ],
            });
        } catch (error) {
            console.error("Failed to generate report:", error);
        }
    };

    /**
     * Deletes a cost item from the database and updates the UI.
     * @param {number} id - ID of the cost item to delete.
     */
    const handleDelete = async (id) => {
        if (!idb) return;

        try {
            await idb.deleteItem("costItems", id);

            // Update report data after deletion
            const updatedData = reportData.filter((item) => item.id !== id);
            setReportData(updatedData);

            // Recalculate category totals for the pie chart
            const categoryTotals = updatedData.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + item.price;
                return acc;
            }, {});

            setChartData({
                labels: Object.keys(categoryTotals),
                datasets: [
                    {
                        data: Object.values(categoryTotals),
                        backgroundColor: [
                            "#FF6384", // Red
                            "#36A2EB", // Blue
                            "#FFCE56", // Yellow
                            "#4BC0C0", // Teal
                            "#9966FF", // Purple
                            "#FF9F40", // Orange
                            "#8D6E63", // Brown
                            "#00C853", // Green
                            "#607D8B", // Grey-Blue
                            "#D81B60"  // Pink
                        ]                    },
                ],
            });

            alert("Item deleted successfully!");
        } catch (error) {
            console.error("Failed to delete item:", error);
            alert("Failed to delete the item.");
        }
    };

    /**
     * Updates an existing cost item in the database.
     * @param {Object} updatedItem - The updated cost item data.
     */
    const handleUpdate = async (updatedItem) => {
        if (!idb) return;

        try {
            await idb.updateItem("costItems", updatedItem.id, updatedItem);

            // Update the report data with the modified item
            const updatedData = reportData.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
            );
            setReportData(updatedData);

            // Recalculate category totals for the pie chart
            const categoryTotals = updatedData.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + item.price;
                return acc;
            }, {});

            setChartData({
                labels: Object.keys(categoryTotals),
                datasets: [
                    {
                        data: Object.values(categoryTotals),
                        backgroundColor: [
                            "#FF6384", // Red
                            "#36A2EB", // Blue
                            "#FFCE56", // Yellow
                            "#4BC0C0", // Teal
                            "#9966FF", // Purple
                            "#FF9F40", // Orange
                            "#8D6E63", // Brown
                            "#00C853", // Green
                            "#607D8B", // Grey-Blue
                            "#D81B60"  // Pink
                        ]                    },
                ],
            });

            alert("Expense updated successfully!");
        } catch (error) {
            console.error("Failed to update item:", error);
            alert("Failed to update the expense.");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h3" align="center" gutterBottom>
                    Cost Manager Application
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
                    Manage your expenses efficiently with monthly insights and data visualization.
                </Typography>

                <Box sx={{ mt: 4 }}>
                    {/* Render components only if the database is initialized */}
                    {idb ? (
                        <>
                            {/* Form to add a new cost item */}
                            <Box sx={{ mb: 4 }}>
                                <AddCostItemForm idb={idb} />
                            </Box>

                            {/* Expense report table */}
                            <ReportTable
                                data={reportData}
                                generateReport={generateReport}
                                handleDelete={handleDelete}
                                handleUpdate={handleUpdate}
                            />

                            {/* Pie chart visualization */}
                            {chartData && (
                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="h5" align="center" gutterBottom>
                                        Expense Distribution
                                    </Typography>
                                    <PieChart chartData={chartData} />
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography align="center">Loading database...</Typography>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default App;