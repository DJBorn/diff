var mode = "character";

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function compare() {

    let input1 = document.getElementById("input1").value;
    let input2 = document.getElementById("input2").value;
    let input1Arr, input2Arr;

    if(mode === "character") {
        input1Arr = input1.split("");
        input2Arr = input2.split("");
    }
    else if(mode === "word") {
        input1Arr = createWhiteSpaceArray(input1);
        input2Arr = createWhiteSpaceArray(input2);
    }
    else if(mode === "line") {
        input1Arr = input1.length > 0 ? input1.split("\n") : [];
        input2Arr = input2.length > 0 ? input2.split("\n") : [];
    }

    for(let i = 0; i < input1Arr.length; i++) {
        input1Arr[i] = input1Arr[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/ /g, "&nbsp;");
    }
    
    for(let i = 0; i < input2Arr.length; i++) {
        console.log("runs?");
        input2Arr[i] = input2Arr[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/ /g, "&nbsp;");
    }
    let changes = diff(input1Arr, input2Arr);
    console.log(changes);
    
    for(let i = 0; i < changes.length; i++) {
        if(changes[i].command === "I") {
            let replacementChar = input2Arr[changes[i].sourceIndex];
            input1Arr.splice(changes[i].insertIndex, 0, "<mark class=\"green\">" + replacementChar + "</mark>");
        }
        if(changes[i].command === "D") {
            let replacementChar = input1Arr[changes[i].index];
            console.log(input1Arr);
            console.log(input2Arr);
            input1Arr[changes[i].index] = "<mark class=\"red\">" + replacementChar + "</mark>";
        }
    }
    
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