import React from "react";
import { Chart } from "react-google-charts";
import { Box, Typography } from "@mui/material";

const PieChart = ({ chartData }) => {
    if (!chartData || !chartData.labels || chartData.labels.length === 0) {
        return (
            <Typography variant="body1" align="center" color="textSecondary">
                No data available to display.
            </Typography>
        );
    }

    const data = [["Category", "Amount"], ...chartData.labels.map((label, index) => [label, chartData.datasets[0].data[index]])];

    const options = {
        title: "Expense Distribution",
        pieHole: 0.4,
        is3D: false,
        backgroundColor: "transparent",
        legend: { position: "bottom" },
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Chart chartType="PieChart" width="600px" height="400px" data={data} options={options} />
        </Box>
    );
};

export default PieChart;
