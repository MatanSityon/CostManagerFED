import React, { useState, useEffect } from "react";
import AddCostItemForm from "./components/AddCostItemForm";
import ReportTable from "./components/ReportTable";
import PieChart from "./components/PieChart";
import IDBWrapper from "./utils/idb";
import { Container, Typography, Box, Paper } from "@mui/material";

const App = () => {
    const [idb, setIdb] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const initializeDB = async () => {
            try {
                const idbInstance = new IDBWrapper("CostManagerDB", 1);
                await idbInstance.openDB([
                    { name: "costItems", options: { keyPath: "id", autoIncrement: true } },
                ]);
                setIdb(idbInstance);
            } catch (error) {
                console.error("Failed to initialize database:", error);
            }
        };

        initializeDB();
    }, []);

    const generateReport = async (month, year) => {
        if (!idb) return;

        try {
            const items = await idb.getItemsByFilter("costItems", (item) => {
                const itemDate = new Date(item.date);
                return (
                    itemDate.getMonth() + 1 === parseInt(month) &&
                    itemDate.getFullYear() === parseInt(year)
                );
            });

            setReportData(items);

            const categoryTotals = items.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + item.amount;
                return acc;
            }, {});

            setChartData({
                labels: Object.keys(categoryTotals),
                datasets: [
                    {
                        data: Object.values(categoryTotals),
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                    },
                ],
            });
        } catch (error) {
            console.error("Failed to generate report:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!idb) return;

        try {
            await idb.deleteItem("costItems", id);
            const updatedData = reportData.filter((item) => item.id !== id);
            setReportData(updatedData);

            const categoryTotals = updatedData.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + item.amount;
                return acc;
            }, {});

            setChartData({
                labels: Object.keys(categoryTotals),
                datasets: [
                    {
                        data: Object.values(categoryTotals),
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                    },
                ],
            });

            alert("Item deleted successfully!");
        } catch (error) {
            console.error("Failed to delete item:", error);
            alert("Failed to delete the item.");
        }
    };

    const handleUpdate = async (updatedItem) => {
        if (!idb) return;

        try {
            await idb.updateItem("costItems", updatedItem.id, updatedItem);
            const updatedData = reportData.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
            );
            setReportData(updatedData);

            const categoryTotals = updatedData.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + item.amount;
                return acc;
            }, {});

            setChartData({
                labels: Object.keys(categoryTotals),
                datasets: [
                    {
                        data: Object.values(categoryTotals),
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                    },
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
                    {idb ? (
                        <>
                            <Box sx={{ mb: 4 }}>
                                <AddCostItemForm idb={idb} />
                            </Box>
                            <ReportTable
                                data={reportData}
                                generateReport={generateReport}
                                handleDelete={handleDelete}
                                handleUpdate={handleUpdate}
                            />
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
