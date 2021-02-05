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
    let changes = diff(input1Arr, input2Arr);
    console.log(changes);
    
    for(let i = 0; i < changes.length; i++) {
        if(changes[i].command === "I") {
            let replacementChar = input2Arr[changes[i].sourceIndex];
            input1Arr.splice(changes[i].insertIndex, 0, "<mark class=\"green\">" + replacementChar + "</mark>");
        }
        if(changes[i].command === "D") {
            let replacementChar = input1Arr[changes[i].index];
            input1Arr[changes[i].index] = "<mark class=\"red\">" + replacementChar + "</mark>";
        }
    }

    // for(let i = 0; i < changes.length; i++) {
    //     if(changes[i].command === "I") {
    //         let replacementChar = input2Arr[changes[i].sourceIndex];
    //         input1Arr.splice(changes[i].insertIndex, 0, "<mark class=\"green\">" + replacementChar + "</mark>");
    //     }
    //     if(changes[i].command === "D") {
    //         let replacementChars = [input1Arr[changes[i].index]];
    //         let isDeletingNextChar = changes[i+1].command == "D" && changes[i].index == changes[i+1].index - 1;
    //         while(isDeletingNextChar) {
    //             i++;
    //             replacementChars.push(index1Arr[changes[i].index]);
    //             isDeletingNextChar = changes[i+1].command == "D" && changes[i].index == changes[i+1].index - 1;
    //         }
    //         input1Arr[changes[i].index] = "<mark class=\"red\">" + replacementChar + "</mark>";
    //     }
    // }
    
    if(mode === "character")
        input1Arr = input1Arr.join("");
    else if(mode === "word") {
        input1Arr = input1Arr.join("");
    }
    else if(mode === "line")
        input1Arr = input1Arr.join("\n");
        
    input1Arr = input1Arr.split("\n");
    
    document.getElementById("output").innerHTML = input1Arr.join('<br>');
    
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