/**
 *   @author Bates, Howard (hbates@northmen.org)
 *   @version 0.0.1
 *   @summary Code demonstration: File I/O :: created: 6.14.2017
 *   @todo Nothing
 */

"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');  // For file I/O

let continueResponse;
let numStudents, menuChoice;
let students = [], rewardStudents = [];
const ADD_STUDENT = 0, DELETE_STUDENT = 1;

/**
 * @method
 * @desc The dispatch method for our program
 * @returns {null}
 */
function main() {
    loadStudents();
    if (continueResponse !== 0 && continueResponse !== 1) {
        setContinueResponse();
    }
    while (continueResponse === 1) {
        setMenuChoice();
        switch (menuChoice) {
            case 1: setNumStudents(); modifyStudents(ADD_STUDENT);
                break;
            case 2: modifyStudents(DELETE_STUDENT);
                break;
            case 3: listStudents();
                break;
            case 4: determineRewardStudent(); displayRewardStudent();
                break;
            default: console.log(`! ERROR !`);
        }
        setContinueResponse();
    }
    writeStudents();
    process.stdout.write('\x1B[2J\x1B[0f');
}

main();

/**
 * @method
 * @desc continueResponse mutator
 * @returns {null}
 */
function setContinueResponse() {
    if (continueResponse) {
        continueResponse = -1;
        while (continueResponse !== 0 && continueResponse !== 1) {
            continueResponse = Number(PROMPT.question(`\nDo you want to continue? [0=no, 1=yes]: `));
        }
    } else {
        continueResponse = 1;
    }
}

/**
 * @method
 * @desc students[][] I/O mutator
 * @returns {null}
 */
function loadStudents() {
    let studentsFile = IO.readFileSync(`data/students_data.csv`, 'utf8');
    let lines = studentsFile.toString().split(/\r?\n/); // Automatically creates SD array on newlines
    for (let i = 0; i < lines.length; i++) {
        students.push(lines[i].toString().split(/,/)); // Makes students array MD by pushing data between commas in
    }
}

/**
 * @method
 * @desc menuChoice mutator
 * @returns {null}
 */
function setMenuChoice() {
    menuChoice = -1;
    while (menuChoice !== 1 && menuChoice !== 2 && menuChoice !== 3 && menuChoice !== 4) {
        menuChoice = Number(PROMPT.question(
            `\tPlease make a selection:
            \t\t1) Add new student
            \t\t2) Remove a student
            \t\t3) List students
            \t\t4) Award student
            \t\tCHOOSE: `
        ));
    }
}

/**
 * @method
 * @desc numStudents mutator
 * @returns {null}
 */
function setNumStudents() {
    const MIN_STUDENTS = 1, MAX_STUDENTS = 34;
    while (!numStudents || numStudents < MIN_STUDENTS || numStudents > MAX_STUDENTS) {
        numStudents = Number(PROMPT.question(`Please enter number of students: `));
        if (isNaN(parseInt(numStudents)) || numStudents < MIN_STUDENTS || numStudents > MAX_STUDENTS) {
            console.log(`${numStudents} is an incorrect value. Please try again.`);
        }
    }
}

/**
 * @method
 * @desc students[][] mutator
 * @returns {null}
 */
function modifyStudents(ADD_DELETE) {
    process.stdout.write('\x1B[2J\x1B[0f');
    const MIN_GRADE = 0, MAX_GRADE = 8;
    let counter = 1;
    if (ADD_DELETE === ADD_STUDENT) {
        while (numStudents > 0) {
            let newStudent = students.length;
            students[newStudent] = [];
            console.log(`Student ${counter}:`);
            while (!students[newStudent][0] || !/^[a-zA-Z -]{1,30}$/.test(students[newStudent][0])) {
                students[newStudent][0] = PROMPT.question(`Please enter last name: `);
                if (!/^[a-zA-Z -]{1,30}$/.test(students[newStudent][0])) {
                    console.log(`${students[newStudent][0]} is invalid. Please try again.`);
                }
            }
            while (!students[newStudent][1] || !/^[a-zA-Z -]{1,30}$/.test(students[newStudent][1])) {
                students[newStudent][1] = PROMPT.question(`Please enter first name: `);
                if (!/^[a-zA-Z -]{1,30}$/.test(students[newStudent][1])) {
                    console.log(`${students[newStudent][1]} is invalid. Please try again.`);
                }
            }
            while (!students[newStudent][2] || !/^\d{2}\/\d{2}\/\d{4}$/.test(students[newStudent][2])) {
                students[newStudent][2] = PROMPT.question(`Please enter date of birth (xx/xx/xxxx): `);
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(students[newStudent][2])) {
                    console.log(`${students[newStudent][2]} is invalid. Please try again.`);
                }
            }
            while (!students[newStudent][3] || students[newStudent][3] < MIN_GRADE || students[newStudent][3] > MAX_GRADE) {
                students[newStudent][3] = Number(PROMPT.question(`Please enter grade level (0-8): `));
                if (students[newStudent][3] < MIN_GRADE || students[newStudent][3] > MAX_GRADE) {
                    console.log(`${students[newStudent][3]} is invalid. Please try again.`);
                }
            }
            while (!students[newStudent][4] || !/^[mMfF]$/.test(students[newStudent][4])) {
                students[newStudent][4] = PROMPT.question(`Please enter gender (m or f): `).toLowerCase();
                if (!/^[mMfF]$/.test(students[newStudent][4])) {
                    console.log(`${students[newStudent][4]} is invalid. Please try again.`);
                }
            }
            console.log(``);
            counter++;
            numStudents--;
        }
    } else {
        let delStudent;
        listStudents();
        while (!delStudent || delStudent < 0 || delStudent > students.length - 1) {
            delStudent = Number(PROMPT.question(`Please enter student number to delete: `));
            if (delStudent < 0 || delStudent > students.length - 1) {
                console.log(`${delStudent} is invalid. Please try again.`);
            }
        }
        students.splice(delStudent, 1);
    }
}

/**
 * @method
 * @desc Utility method to list students
 * @returns {null}
 */
function listStudents() {
    process.stdout.write('\x1B[2J\x1B[0f');
    const COLUMNS = 5;
    console.log(`NUM  LAST  FIRST   DOB      GRADE   GENDER\n==========================================`);
    for (let i = 0; i < students.length; i++) {
        process.stdout.write(`${i}  `);
        for (let j = 0; j < COLUMNS; j++) {
            if (j < COLUMNS - 1) {
                process.stdout.write(`${students[i][j]},  `);
            } else {
                process.stdout.write(`${students[i][j]}\n`);
            }
        }
    }
}

/**
 * @method
 * @desc rewardedStudents[] mutator
 * @returns {null}
 */
function determineRewardStudent() {
    let rewarded = false;
    while (! rewarded) {
        rewarded = true;
        let randomStudent = Math.floor((Math.random() * students.length));
        if (rewardStudents.length > 0 && rewardStudents.length < students.length) {
            for (let student of rewardStudents) {
                if (student === randomStudent) {
                    rewarded = false;
                    break;
                }
            }
            if (rewarded) {
                rewardStudents.push(randomStudent);
                break;
            }
        } else {
            rewardStudents = [];
            rewardStudents.push(randomStudent);
        }
    }
    console.log(rewardStudents);
}

/**
 * @method
 * @desc Utility method for outputting result
 * @returns {null}
 */
function displayRewardStudent() {
    console.log(`You get to reward ${students[rewardStudents[rewardStudents.length - 1]][0]} today!`);
}

/**
 * @method
 * @desc Utility method for writing students[][] to disk file
 * @returns {null}
 */
function writeStudents() {
    const COLUMNS = 5;
    for (let i = 0; i < students.length; i++) {
        if (students[i]) {
            for (let j = 0; j < COLUMNS; j++) {
                if (j < COLUMNS - 1) {
                    IO.appendFileSync(`data/dataX.csv`, `${students[i][j]},`);
                } else if (i < students.length - 1) {
                    IO.appendFileSync(`data/dataX.csv`, `${students[i][j]}\n`);
                } else {
                    IO.appendFileSync(`data/dataX.csv`, `${students[i][j]}`);
                }
            }
        }
    }
    IO.unlinkSync(`data/students_data.csv`);
    IO.renameSync(`data/dataX.csv`, `data/students_data.csv`);
}

/*
 The "Hurr Durr, Make 'em Smarter Everyday" private school has asked you to refactor the program you wrote for lesson 6
 to allow the ability to read the student data from a file on permanent storage as well as save data to the file for
 permanent storage.

 Topics:  File I/O
 */