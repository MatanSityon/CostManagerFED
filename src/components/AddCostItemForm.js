import React, { useState } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const AddCostItemForm = ({ idb }) => {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async () => {
        if (!idb) {
            alert("Database is not initialized yet.");
            return;
        }

        if (!amount || !category || !description || !date) {
            alert("All fields are required!");
            return;
        }

        try {
            await idb.addItem("costItems", {
                amount: parseFloat(amount),
                category,
                description,
                date,
            });

            setAmount("");
            setCategory("");
            setDescription("");
            setDate("");
            alert("Cost item added successfully!");
        } catch (error) {
            console.error("Error adding item to database:", error);
            alert("Failed to add item.");
        }
    };

    return (
        <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2, backgroundColor: "#f9f9f9" }}>
            <FormControl fullWidth margin="normal">
                <TextField
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Transportation">Transportation</MenuItem>
                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </FormControl>
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                Add Item
            </Button>
        </Box>
    );
};

export default AddCostItemForm;
