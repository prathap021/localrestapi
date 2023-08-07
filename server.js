const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const dataPath = 'data.json';

app.use(bodyParser.json());

// Read data from the JSON file
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data from file:', err);
    return [];
  }
};

// Write data to the JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Data written to file successfully.');
  } catch (err) {
    console.error('Error writing data to file:', err);
  }
};

// Retrieve all records
app.get('/api/records', (req, res) => {
  const data = readData();
  res.json(data);
});

// Create a new record
app.post('/api/createrecords', (req, res) => {
  const data = readData();
  const newRecord = req.body;
  data.push(newRecord);
  writeData(data);
  res.status(201).json(newRecord);
});

// Update a record by ID
app.put('/api/records/:id', (req, res) => {
  const data = readData();
  const recordId = parseInt(req.params.id);
  const updatedRecord = req.body;
  const index = data.findIndex((record) => record.id === recordId);

  if (index !== -1) {
    data[index] = { ...data[index], ...updatedRecord };
    writeData(data);
    res.json(data[index]);
  } else {
    res.status(404).json({ message: 'Record not found.' });
  }
});

// Delete a record by ID
app.delete('/api/records/:id', (req, res) => {
  const data = readData();
  const recordId = parseInt(req.params.id);
  const index = data.findIndex((record) => record.id === recordId);

  if (index !== -1) {
    const deletedRecord = data.splice(index, 1);
    writeData(data);
    res.json(deletedRecord[0]);
  } else {
    res.status(404).json({ message: 'Record not found.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}/api/records`);
    console.log(`Server is running on port http://127.0.0.1:${PORT}/api/createrecords`);
});
