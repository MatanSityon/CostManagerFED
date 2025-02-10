import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Typography, Box, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

/**
 * Report table component that displays expenses, allows editing and deleting.

 * @param {Array} data - Expense data.
 * @param {Function} generateReport - Function to fetch report data.
 * @param {Function} handleDelete - Function to delete an expense item.
 * @param {Function} handleUpdate - Function to update an expense item.
 */
const ReportTable = ({ data, generateReport, handleDelete, handleUpdate }) => {
    const [month, setMonth] = useState(""); // Selected month
    const [year, setYear] = useState(""); // Selected year
    const [editItem, setEditItem] = useState(null); // Stores the item being edited

    /**
     * Triggers the report generation.
     */
    const handleGenerate = () => {
        if (!month || !year) {
            alert("Please select both month and year.");
            return;
        }
        generateReport(month, year);
    };

    /**
     * Opens the edit dialog for a specific expense item.
     * @param {Object} item - The expense item to edit.
     */
    const openEditDialog = (item) => {
        setEditItem(item);
    };

    /**
     * Closes the edit dialog.
     */
    const closeEditDialog = () => {
        setEditItem(null);
    };

    /**
     * Handles changes in the edit dialog fields.
     * @param {string} field - The field being modified.
     * @param {string} value - The new value for the field.
     */
    const handleEditChange = (field, value) => {
        setEditItem((prev) => ({
            ...prev,
            [field]: field === "price" ? parseFloat(value) : value,
        }));
    };

    /**
     * Submits the edited expense data.
     */
    const handleEditSubmit = () => {
        handleUpdate(editItem);
        generateReport(month, year);
        closeEditDialog();
    };

    // Ensure data is properly updated
    const filteredData = data && Array.isArray(data) ? data : [];

    // Calculate total expenses for the summary row
    const totalExpenses = filteredData.reduce((sum, item) => sum + item.price, 0);


    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Generate Monthly Report
            </Typography>

            {/* Report filtering section */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select value={month} onChange={(e) => setMonth(e.target.value)} label="Month">
                        {[...Array(12).keys()].map((m) => (
                            <MenuItem key={m + 1} value={m + 1}>
                                {new Date(0, m).toLocaleString("en-US", { month: "long" })}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select value={year} onChange={(e) => setYear(e.target.value)} label="Year">
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Button to generate report */}
                <Button variant="contained" color="primary" onClick={handleGenerate} sx={{ width: '150px' }}>
                    Generate
                </Button>
            </Box>

            {/* Expense table */}
            {filteredData.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Price</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="primary" onClick={() => openEditDialog(item)}>
                                            Edit
                                        </Button>
                                        <Button variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => handleDelete(item.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* Summary Row */}
                            <TableRow>
                                <TableCell colSpan={4} align="right">
                                    <strong>Total Expenses:</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>{totalExpenses.toFixed(2)}</strong>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : null}

            {/* Edit Dialog */}
            {editItem && (
                <Dialog open={!!editItem} onClose={closeEditDialog}>
                    <DialogTitle>Edit Expense</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Price"
                            type="number"
                            value={editItem.price}
                            onChange={(e) => handleEditChange("price", e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select value={editItem.category} onChange={(e) => handleEditChange("category", e.target.value)}>
                                <MenuItem value="FOOD">FOOD</MenuItem>
                                <MenuItem value="CAR">CAR</MenuItem>
                                <MenuItem value="ENTERTAINMENT">ENTERTAINMENT</MenuItem>
                                <MenuItem value="HEALTH">HEALTH</MenuItem>
                                <MenuItem value="TRAVEL">TRAVEL</MenuItem>
                                <MenuItem value="SHOPPING">SHOPPING</MenuItem>
                                <MenuItem value="EDUCATION">EDUCATION</MenuItem>
                                <MenuItem value="BILLS">BILLS</MenuItem>
                                <MenuItem value="INVESTMENT">INVESTMENT</MenuItem>
                                <MenuItem value="OTHER">OTHER</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Description"
                            value={editItem.description}
                            onChange={(e) => handleEditChange("description", e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Date"
                            type="date"
                            value={editItem.date}
                            onChange={(e) => handleEditChange("date", e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeEditDialog}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleEditSubmit}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default ReportTable;