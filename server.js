//ENDPOINTS
//=====================================================
//POST::localhost:PORT/employees = Inserts new employee data
//GET::localhost:PORT/ = json with all the employees
//GET::localhost:PORT/employees/id = json with specific id
//PUT::localhost:PORT/employees/id = update specific employee
//DELETE::localhost:PORT/employees/id = delete a specific employee

// Dependencies
// =========================================
const express = require("express");
const app = express();
const fs = require("fs");
//Middleware
app.use(express.json());
// Environment Variable
//============================================
let PORT = process.env.PORT || 3000;
//Data
// =================================================
let employees = require("./employees.json");
//Routes
//basic route that sends all the employee data on a get request to the root path
app.get("/", (req, res) => {
    res.send(employees);
});
//Basic route that sends a single employee by their ID
app.get("/employees/:id", (req, res) => {
    const chosen = employees.find(e => e.employeeID === req.params.id);
    if (!chosen) return res.status(400).send(`Couldnt find the employee`);
    res.send(chosen);
});
// This route creates an employee
app.post("/employees", (req, res) => {
    //Here I validate the request
    if (!req.body.name || req.body.name.length < 3) {
        res.status(400).send(`Name is required and should be minimum 3 characters`);
    } else if (!req.body.salary) {
        res.status(400).send(`Salary is required`);
    } else if (!req.body.dptName) {
        res.status(400).send(`Department is required`);
    }
    // This is the schema for the post method
    let employee = {
        employeeID: employees.length + 1,
        name: req.body.name,
        salary: req.body.salary,
        dptName: req.body.dptName
    };
    //This is where i push my new employee
    employees.push(employee);
    res.send(employees);
});
//This route updates an especific employee
app.put("/employees/:id", (req, res) => {
    //finding the employee
    let employee = employees.find(e => e.employeeID === req.params.id);
    // here i validate and send status code if the employee is not existent
    if (!employee) res.status(404).send("Employee not found");
    // here i set the employees values to the ones in the request
    employee.name = req.body.name;
    employee.salary = req.body.salary;
    if (req.body.dptName) {
        return (employee.dptName = req.body.dptName);
    }
    res.send(`${employee.name} has been added`);
});
app.delete("/employees/:id", (req, res) => {
    //finding the employee
    let employee = employees.find(e => e.employeeID === req.params.id);
    //Check if the employee exists
    if (!employee) res.status(400).send(`Employee not found`);
    //Here i remove the employee
    employees.splice(employee.employeeID - 1, 1);
    //And send the new list of employees
    res.send(employees);
});
//Setting up the server to listen on the environment variable i created
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
