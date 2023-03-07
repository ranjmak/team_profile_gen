const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");


// Code to gather information about the development team members and calls render() to generate the HTML file.

const employees = [];

// promptUser is an asynchronous function (like the inquirer.prompt()... 
// so functions that call this have to use await 
async function promptUser() {
  let done = false; // boolean controlling the main loop
  let firstPass = true; // remember, for he first pass, we want to capture the manager details. subsequent passes, we will 
                        // capture the rest of the team or finish building the team.
  let roleChoice = ['Add an Engineer', 'Add an Intern', 'Finished building the team'];

  while (!done) {
    let role = ''; // controls the requirements for the type of employee

    if (!firstPass) {
      const {action}  = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do',
        choices: roleChoice,
      });
      switch (action) {
        case 'Add an Engineer': {
          role = 'Engineer';
          break;
        }
        case 'Add an Intern': {
          role = 'Intern';
          break;
        }
        case 'Finished building the team': {
          done = true;
          break;
        }
      }
    } else {
      firstPass = false;
      role = 'Manager';
    }

    if (!done) { // need to add this as once user has finished building the team, we don't want to ask questions anymore!
      const questions = [
        {
          type: 'input',
          name: 'name',
          message: `What is the ${role}'s name?`,
          validate: (value) => { // use the inquirer validate boolean to ensure reasonable user input!
            if (value.trim().length === 0) {
              return 'Please enter a name.';
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'id',
          message: `What is the ${role}'s ID?`,
          validate: (value) => { // ID's are usually numbers. so we can use !isNaN() - is not a number to validate
            const valid = !isNaN(parseInt(value));
            return valid || 'Please enter a number.';
          },
        },
        {
          type: 'input',
          name: 'email',
          message: `What is the ${role}'s email address?`,
          validate: (value) => { // check for: some text, then an @ symbol, then some text, then a . followed by some text
            const valid = /\S+@\S+\.\S+/.test(value);
            return valid || 'Please enter a valid email address.';
          },
        },
      ];

      if (role === 'Manager') {
        questions.push({
          type: 'input',
          name: 'officeNumber',
          message: 'What is the manager\'s office number?',
          validate: (value) => {
            const valid = !isNaN(parseInt(value));
            return valid || 'Please enter a number.';
          },
        });
      } else if (role === 'Engineer') {
        questions.push({
          type: 'input',
          name: 'github',
          message: 'What is the engineer\'s GitHub username?',
          validate: (value) => {
            if (value.trim().length === 0) {
              return 'Please enter a GitHub username.';
            }
            return true;
          },
        });
      } else if (role === 'Intern') {
        questions.push({
          type: 'input',
          name: 'school',
          message: 'What school/college/university is the intern attending?',
          validate: (value) => {
            if (value.trim().length === 0) {
              return 'Please enter the school/college/university\'s name.';
            }
            return true;
          },
        });
      }

      // destructure the inquirer returned object to directly have values stored in the required variables
      const { name, id, email, officeNumber, github, school } = await inquirer.prompt(questions);

      try {
        switch (role) {
          case 'Manager':
            employees.push(new Manager(name, id, email, officeNumber));
            break;
          case 'Engineer':
            employees.push(new Engineer(name, id, email, github));
            break;
          case 'Intern':
            employees.push(new Intern(name, id, email, school));
            break;
        }
        console.log('Employee added!');
      } catch (error) {
        console.error(error.message); // maybe we should manage the errors? not a requirement mind!
      }
    }
  }
}

// starter function
async function init() {
  console.log('Please enter information about each employee. Press Ctrl+C at any time to quit.');

  try {
    await promptUser();
  } catch (error) {
    console.error(error);
  }

  const html = render(employees);
  fs.writeFile(outputPath, html, (err) => {
    if (err) throw err;
    console.log('Team page generated! Check out team.html in the output folder to see it.');
  });
}

// call the starter function to get the ball rolling!
init();