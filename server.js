const inquirer = require('inquirer');
const connection = require('./config/connection');
require('console.table');

connection.connect(err => {
    if(err) throw err;
    console.log('Connected.');
    // updateEmployee();
});

//updates the employee information
var updateEmployee = () => {
    inquirer.prompt(
        { 
            name: 'empChoice',
            type: 'list',
            message: 'Please make your selection:',
            choices: [
                'View all employees',
                'View departments',
                'View roles',
                'Add an employee',
                'Add a department',
                'Add a role',
                'Update an employee role',
                'Quit'
            ]
        }
    ) //once the choice is selected, run the function 
    .then(answer => { //according to the the case of that choice
        switch (answer.empChoice){
            case 'View all employees':
                viewEmployees();
                break;
            case 'View departments':
                viewDepts();
                break;
            case 'View roles':
                viewRoles();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Add a department':
                addDept();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Update an employee role':
                updateEmpRole();
                break;
            case 'Quit':
                quitConnection();
        }
    });
};

//views all of the employees
const viewEmployees = () => {
    const query = `SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.log('Viewing all of the employees:');
        console.table(res);
        updateEmployee();
    });
};

//views all of the departments
const viewDepts = () => {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.log('Viewing all of the departments:');
        console.table(res);
        updateEmployee();
    });
};

//views all of the roles
const viewRoles = () => {
    rolesArr = [];
    const query = `SELECT * FROM role`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        res.forEach(({title}) => {
            rolesArr.push(title);
        console.log('Viewing the employee roles:');
        console.table(res);
        console.log(rolesArr);
        updateEmployee();
        });
    });
};

//adds a new employee with prompts
const addEmployee = () => {
    inquirer.prompt([
        {      
        type: 'input',
        message: "Employee's first name:",
        name: 'firstName'
        },
        { 
        type: 'input',
        message: "Employee's last name:",
        name: 'lastName'
        },
        {
        type: 'input',
        message: "Employee's role ID:",
        name: 'roleId'
        }
    ]).then((answers)=>{
        connection.query(`INSERT INTO employee SET ?`,
        {
        first_name: answers.firstName,
        last_name: answers.lastName,
        role_id: answers.roleId
        },
        (err) => {
            if (err) throw err;
            console.log('The employee has been added.');
            console.table(answers);
            updateEmployee();
        })
    })
};

//prompts to add a new department
const addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department that you would like to add?',
            name: 'newDept'
        }
    ])
    .then(({ newDept }) => {
        connection.query(`INSERT INTO department SET ?`,
        {
            name: newDept
        },
        (err) => {
            if(err) throw err;
            console.log('The department has been added.');
            console.table({ newDept });
            updateEmployee();
        })
    })
};

//adds roles
const addRole = () => {
    connection.query(`SELECT * FROM department`, (err, res) => {  
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the name of the role you would like to add:',
            name: 'newRole'
        },
        {
            type: 'input',
            message: 'Please enter the salary for this role:',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Which department is this role in?',
            name: 'deptChoice',
            choices: res.map((department) => department.name)
        }
    ])
    .then(({newRole, salary, deptChoice}) => {
        res.map(userRes => {
            if(userRes.name === deptChoice){
                let newDeptId = userRes.id;
                connection.query(`INSERT INTO role SET ?`,
                {
                    title: newRole,
                    salary: salary,
                    department_id: newDeptId
                });
            }
        })
    updateEmployee();
    });
});
//pushes data into the empty employees array
employeeArr = [];
    const query = 'SELECT first_name FROM employee';
    connection.query(query, (err, res) => {
        if(err) throw err;
        res.forEach(({first_name}) => {
            employeeArr.push(first_name);
        });
    });
//pushes data into the empty roles array
    rolesArr = [];
    const secondQuery = `SELECT title FROM role`;
    connection.query(secondQuery, (err, res) => {
        if(err) throw err;
        res.forEach(({title}) => {
            rolesArr.push(title);
        });
    });

//updates the employee's role
const updateEmpRole = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Please choose which employee you would like to update:',
            choices: employeeArr,
            name: 'updateRole'
        },
        {
            type: 'list',
            message: 'Please choose which role you would like to change the employee to:',
            choices: rolesArr,
            name: 'newRole'
        }
    ])
    .then((answers) => {
        connection.query(`UPDATE role SET title = ? WHERE first_name = ?`,
        {
            title: answers.newRole,
            first_name: answers.roleUpdate
        },
        (err) => {
            if(err) throw err;
            updateEmpRole();
            console.log("The employee's role has been updated.");
            console.table(answers);
            updateEmployee();
        })
    })
}

}
const quitConnection = () => connection.end();
updateEmployee();
