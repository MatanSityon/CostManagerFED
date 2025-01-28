import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

const ReportTable = ({ data, generateReport, handleDelete, handleUpdate }) => {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [editItem, setEditItem] = useState(null);

    const handleGenerate = () => {
        if (!month || !year) {
            alert("Please select both month and year.");
            return;
        }
        generateReport(month, year);
    };

    const openEditDialog = (item) => {
        setEditItem(item);
    };

    const closeEditDialog = () => {
        setEditItem(null);
    };

    const handleEditChange = (field, value) => {
        setEditItem((prev) => ({
            ...prev,
            [field]: field === "amount" ? parseFloat(value) : value,
        }));
    };

    const handleEditSubmit = () => {
        handleUpdate(editItem);
        closeEditDialog();
    };

    const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Generate Monthly Report
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                {/* Month Selector */}
                <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select value={month} onChange={(e) => setMonth(e.target.value)} label="Month">
                        {[...Array(12).keys()].map((m) => (
                            <MenuItem key={m + 1} value={m + 1}>
                                {new Date(0, m).toLocaleString("default", { month: "long" })}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Year Selector */}
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

                {/* Generate Button */}
                <Button variant="contained" color="primary" onClick={handleGenerate}>
                    Generate
                </Button>
            </Box>

            {data.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Amount</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => openEditDialog(item)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            sx={{ ml: 1 }}
                                            onClick={() => handleDelete(item.id)}
                                        >
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
            ) : (
                <Typography>No data available for the selected month and year.</Typography>
            )}

            {/* Edit Dialog */}
            {editItem && (
                <Dialog open={!!editItem} onClose={closeEditDialog}>
                    <DialogTitle>Edit Expense</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Amount"
                            type="number"
                            value={editItem.amount}
                            onChange={(e) => handleEditChange("amount", e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={editItem.category}
                                onChange={(e) => handleEditChange("category", e.target.value)}
                            >
                                <MenuItem value="Food">Food</MenuItem>
                                <MenuItem value="Transportation">Transportation</MenuItem>
                                <MenuItem value="Entertainment">Entertainment</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
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
