/**
 *   @author Bates, Howard (hbates@northmen.org)
 *   @version 0.0.1
 *   @summary Code demonstration: Control Break Algorithm :: created: 6.14.2017
 *   @todo Nothing
 */

"use strict";
const IO = require('fs');  // For file I/O

let data = [];

/**
 * @method
 * @desc The dispatch method for our program
 * @returns {null}
 */
function main() {
    loadData();
    sortData();
    printData();
    processReport();
}

main();

/**
 * @method
 * @desc data mutator
 * @returns {null}
 */
function loadData() {
    let dataFile = IO.readFileSync(`data/data.csv`, 'utf8');
    let lines = dataFile.toString().split(/\r?\n/); // Automatically creates SD array on newlines
    for (let i = 0; i < lines.length; i++) {
        data.push(lines[i].toString().split(/,/)); // Makes students array MD by pushing data between commas in
    }
}

/**
 * @method
 * @desc Insertion Sort data Array
 * @returns {null}
 */
function sortData() {
    console.log(`Insertion Sorting MD Array`);
    const ID = 0, NAME = 1, VALUE = 2, POLICY_TYPE = 3;
    let temp;
    for (let i = 1; i < data.length; i++) {
        let j = i;
        while (j > 0 && data[j][POLICY_TYPE] < data[j - 1][POLICY_TYPE]) {
            temp = data[j][POLICY_TYPE];
            data[j][POLICY_TYPE] = data[j - 1][POLICY_TYPE];
            data[j - 1][POLICY_TYPE] = temp;

            temp = data[j][ID];
            data[j][ID] = data[j - 1][ID];
            data[j - 1][ID] = temp;

            temp = data[j][NAME];
            data[j][NAME] = data[j - 1][NAME];
            data[j - 1][NAME] = temp;

            temp = data[j][VALUE];
            data[j][VALUE] = data[j - 1][VALUE];
            data[j - 1][VALUE] = temp;

            j--;
        }
    }
}

/**
 * @method
 * @desc Print data Array
 * @returns {null}
 */
function printData() {
    console.log(data);
}

/**
 * @method
 * @desc Perform Control Break Algorithm on Sorted data Array
 * @returns {null}
 */
function processReport() {
    const NAME = 1, VALUE = 2, POLICY_TYPE = 3;
    const HEADER = `\n        Value by Policy Type\n`;
    const SEPERATOR = `==========================================\n\n`;
    let legacyPolicyType = Number(data[0][POLICY_TYPE]);
    let policyTypeValue = 0;
    IO.appendFileSync(`data/dataX.csv`, HEADER);
    IO.appendFileSync(`data/dataX.csv`, SEPERATOR);

    for (let i = 0; i < data.length; i++) {
        if (legacyPolicyType !== data[i][POLICY_TYPE]) {
            writeSummary(policyTypeValue, legacyPolicyType);
            policyTypeValue = 0;
        }
        IO.appendFileSync(`data/dataX.csv`, `${data[i][NAME]}, ${data[i][VALUE]}`);
        policyTypeValue = (policyTypeValue + data[i][VALUE]);
        legacyPolicyType = data[i][POLICY_TYPE];
    }
    writeSummary(policyTypeValue, legacyPolicyType);
}

/**
 * @method
 * @desc Print Final Summary
 * @returns {null}
 */
function writeSummary(policyTypeValue, legacyPolicyType) {
    const SEPERATOR = `___________________________________________\n\n`;
    IO.appendFileSync(`data/dataX.csv`, `\nTotal value for ${legacyPolicyType} is ${policyTypeValue}\n`);
    IO.appendFileSync(`data/dataX.csv`, SEPERATOR);
}