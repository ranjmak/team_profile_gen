const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.

const employees = [];

async function promptUser() {
  let done = false;
  while (!done) {
    const { role } = await inquirer.prompt({
      type: 'list',
      name: 'role',
      message: 'What is the employee\'s role?',
      choices: ['Manager', 'Engineer', 'Intern'],
    });

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: `What is the ${role}'s name?`,
      },
      {
        type: 'input',
        name: 'id',
        message: `What is the ${role}'s ID?`,
      },
      {
        type: 'input',
        name: 'email',
        message: `What is the ${role}'s email address?`,
      },
    ];

    if (role === 'Manager') {
      questions.push({
        type: 'input',
        name: 'officeNumber',
        message: 'What is the manager\'s office number?',
      });
    } else if (role === 'Engineer') {
      questions.push({
        type: 'input',
        name: 'github',
        message: 'What is the engineer\'s GitHub username?',
      });
    } else if (role === 'Intern') {
      questions.push({
        type: 'input',
        name: 'school',
        message: 'What school is the intern attending?',
      });
    }

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
      console.error(error.message);
    }

    const { continueAdding } = await inquirer.prompt({
      type: 'confirm',
      name: 'continueAdding',
      message: 'Add another employee?',
      default: false,
    });

    done = !continueAdding;
  }
}

async function init() {
  console.log('Please enter information about each employee. Press Ctrl+C at any time to quit.');

  try {
    await promptUser();
  } catch (error) {
    console.error(error);
  }

  const html = render(employees);
  fs.writeFile('team.html', html, (err) => {
    if (err) throw err;
    console.log('Team page generated! Check out team.html to see it.');
  });
}

init();