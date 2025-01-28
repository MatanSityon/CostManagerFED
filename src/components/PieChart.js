import React from "react";
import { Chart } from "react-google-charts";
import { Box, Typography } from "@mui/material";

/**
 * Pie chart component to visualize expense distribution.
 * @param {Object} chartData - The chart data formatted for Google Charts.
 */
const PieChart = ({ chartData }) => {
    // Handle case where no data is available
    if (!chartData || !chartData.labels || chartData.labels.length === 0) {
        return (
            <Typography variant="body1" align="center" color="textSecondary">
                No data available to display.
            </Typography>
        );
    }

    // Convert the given dataset into a format compatible with Google Charts
    const data = [["Category", "Price"], ...chartData.labels.map((label, index) => [label, chartData.datasets[0].data[index]])];

    // Chart display options
    const options = {
        title: "Expense Distribution",
        pieHole: 0.4, // Creates a "donut" effect
        is3D: false,
        backgroundColor: "transparent",
        legend: { position: "bottom" },
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* Render Google Charts Pie Chart */}
            <Chart chartType="PieChart" width="600px" height="400px" data={data} options={options} />
        </Box>
    );
};

export default PieChart;