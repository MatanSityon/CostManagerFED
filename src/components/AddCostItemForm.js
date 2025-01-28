import React, { useState } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

/**
 * Component for adding a new cost item to IndexedDB.
 * @param {Object} idb - The IndexedDB instance.
 */
const AddCostItemForm = ({ idb }) => {
    const [price, setPrice] = useState(""); // User input for price
    const [category, setCategory] = useState(""); // User input for category
    const [description, setDescription] = useState(""); // User input for description
    const [date, setDate] = useState(""); // User input for date

    /**
     * Handles form submission to add a cost item.
     */
    const handleSubmit = async () => {
        if (!idb) {
            alert("Database is not initialized yet.");
            return;
        }

        // Validate inputs before adding to IndexedDB
        if (!price || !category || !description || !date) {
            alert("All fields are required!");
            return;
        }

        try {
            await idb.addItem("costItems", {
                price: parseFloat(price), // Convert price to a number
                category,
                description,
                date,
            });

            // Reset form fields after successful addition
            setPrice("");
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
            {/* Input for price */}
            <FormControl fullWidth margin="normal">
                <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </FormControl>

            {/* Dropdown for category selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
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

            {/* Input for description */}
            <FormControl fullWidth margin="normal">
                <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>

            {/* Input for date selection */}
            <FormControl fullWidth margin="normal">
                <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            </FormControl>

            {/* Button to submit the form */}
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                Add Item
            </Button>
        </Box>
    );
};

export default AddCostItemForm;