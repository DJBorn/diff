var mode = "character";

function compare() {
    // Get value from the input text fields
    let input1 = document.getElementById("input1").value;
    let input2 = document.getElementById("input2").value;

    // Split the string into an array split based on the comparison type (character, word, new line)
    let input1Arr = splitStringBasedOnCompareType(input1, mode);
    let input2Arr = splitStringBasedOnCompareType(input2, mode);

    // Replace HTML encoding of special characters
    input1Arr = replaceWithHTMLEncoding(input1Arr);
    input2Arr = replaceWithHTMLEncoding(input2Arr);

    // Get edit script of the two arrays
    let editScript = diff(input1Arr, input2Arr);
    
    // Create new array after applying edit script
    let outputArr = processEditScript(input1Arr, input2Arr, editScript, mode);
    
    // Generate the final HTML output
    outputArr = generateHTMLString(outputArr, mode);
    
    document.getElementById("output").innerHTML = outputArr;
}

// Generate the final HTML string based on the mode
function generateHTMLString(arr, mode) {
    
    if(mode === "character")
        arr = arr.join("");
    else if(mode === "word")
        arr = arr.join("");
    else if(mode === "line")
        arr = arr.join("\n");
        
    return arr.split("\n").join('<br>');
}

// Generate the new string after applying all of the changes in the given editScript
function processEditScript(arr1, arr2, editScript, mode) {
    let outputArr = [];
    let deletedArr = [];
    let insertedArr = [];
    let startedInserting = false;
    let startedDeleting = false;

    let insertIndex = -1;
    let insertString = [];

    for(let i = 0; i < editScript.length; i++) {
        if(editScript[i].command == "I") {
            if(!startedInserting) {
                startedInserting = true;
                insertIndex = editScript[i].insertIndex;
                insertString.push(arr2[editScript[i].sourceIndex])
            } else if(startedInserting && editScript[i].insertIndex == insertIndex) {
                insertString.push(arr2[editScript[i].sourceIndex]);
            } else if (startedInserting){
                insertedArr[insertIndex] = mode == "line" ? insertString.join('\n') : insertString.join('');
                insertIndex = editScript[i].insertIndex;
                insertString = [arr2[editScript[i].sourceIndex]];
            } 
        }
        
        if((editScript[i].command != "I" && startedInserting) || (startedInserting && i == editScript.length - 1)) {
            insertedArr[insertIndex] = mode == "line" ? insertString.join('\n') : insertString.join('');
            insertString = [];
            startedInserting = false;
        }

        if(editScript[i].command == "D")
            deletedArr[editScript[i].index] = arr1[editScript[i].index];
    }
    
    for(let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
        let newStringAtIndex = [];

        if((deletedArr[i] == null && startedDeleting) || (startedDeleting && i == arr1.length-1)) {
            startedDeleting = false;
            newStringAtIndex.push("</mark>");
        }
        if(insertedArr[i] != null) {
            newStringAtIndex.push("<mark class=\"green\">" + insertedArr[i] + "</mark>");
            if(mode == "line")
                newStringAtIndex.push("\n");
        }
        if(deletedArr[i] != null) {
            if(!startedDeleting) {
                startedDeleting = true;
                newStringAtIndex.push("<mark class=\"red\">" + arr1[i]);
            } else {
                newStringAtIndex.push(arr1[i]);
            }
        }
        if(deletedArr[i] == null)
            newStringAtIndex.push(arr1[i]);

        outputArr.push(newStringAtIndex.join(''));
    }
    
    return outputArr;
}

// Replace each character in each string of an array with the HTML encoding
function replaceWithHTMLEncoding(arr) {
    let resultArr = [];
    for(let i = 0; i < arr.length; i++) {
        resultArr[i] = arr[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/ /g, "&nbsp;");
    }
    return resultArr;
}

// Take a string and create an array splitting based on character, word, or line
function splitStringBasedOnCompareType(str, type) {
    let resultArr = [];
    if(type === "character") {
        resultArr = str.split("");
    }
    else if(type === "word") {
        resultArr = createWhiteSpaceArray(str);
    }
    else if(type === "line") {
        resultArr = str.length > 0 ? str.split("\n") : [];
    }
    return resultArr;
}

// Take in a string, and create an array that will split the string into 2 groups: whitespaces (newline & space) and every other character
function createWhiteSpaceArray(str) {
    let isParsingWhitespace;
    let currentString = [];
    let result = [];
    
    for(let i = 0; i < str.length; i++) {
        let currentCharIsWhitespace = str[i] == " " || str[i] == "\n";
        if(isParsingWhitespace == undefined) {
            if(currentCharIsWhitespace) {
                isParsingWhitespace = true;
            } else {
                isParsingWhitespace = false;
            }
            currentString.push(str[i]);
            continue;
        }

        if((isParsingWhitespace == true && currentCharIsWhitespace) ||
           (isParsingWhitespace == false && !currentCharIsWhitespace)) {
            currentString.push(str[i]);
        } else {
            result.push(currentString.join(''));
            currentString = [str[i]];
            isParsingWhitespace = !isParsingWhitespace;
        }
    }

    if(currentString.length > 0)
        result.push(currentString.join(''));
    return result;
}

document.getElementById("input1").addEventListener("change", compare);
document.getElementById("input2").addEventListener("change", compare);

document.getElementById("character").addEventListener("change", ()=>{ if(document.getElementById("character").checked) mode = "character"; compare();});
document.getElementById("word").addEventListener("change", ()=>{ if(document.getElementById("word").checked) mode = "word"; compare();});
document.getElementById("line").addEventListener("change", ()=>{ if(document.getElementById("line").checked) mode = "line"; compare();});

compare();