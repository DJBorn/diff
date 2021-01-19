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
        input1Arr = input1.split(" ");
        input2Arr = input2.split(" ");
        // input1Arr = [];
        // input2Arr = [];
        // let curWord = "";
        // let endWord = false;
        // for(let i = 0; i < input1.length; i++) {
        //     while(!(endWord && input1[i] == " ") && i < input1.length) {
        //         curWord += input1[i];
        //         if(input1[i] != " ")
        //             endWord = true;
        //         i++;
        //     }
        //     i--;
        //     input1Arr.push(curWord);
        //     curWord = "";
        //     endWord = false;
        // }
        // console.log(input1Arr);
        // for(let i = 0; i < input2.length; i++) {
        //     while(!(endWord && input2[i] == " ") && i < input2.length) {
        //         curWord += input2[i];
        //         if(input2[i] != " ")
        //             endWord = true;
        //         i++;
        //     }
        //     i--;
        //     input2Arr.push(curWord);
        //     curWord = "";
        //     endWord = false;
        // }
    }
    else if(mode === "line") {
        input1Arr = input1.split("\n");
        input2Arr = input2.split("\n");
    }

    for(let i = 0; i < input1Arr.length; i++) {
        input1Arr[i] = input1Arr[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/ /g, "&nbsp;");
    }
    
    for(let i = 0; i < input2Arr.length; i++) {
        input2Arr[i] = input2Arr[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/ /g, "&nbsp;");
    }
    let changes = diff(input1Arr, input2Arr);
    
    console.log(changes);
    for(let i = 0; i < changes.length; i++) {
        if(changes[i].command === "I") {
            let replacementChar = input2Arr[changes[i].sourceIndex]; // input2Arr[changes[i].sourceIndex] == "" ? "&nbsp;" : input2Arr[changes[i].sourceIndex];
            input1Arr.splice(changes[i].insertIndex, 0, "<mark class=\"green\">" + replacementChar + "</mark>");
        }
        if(changes[i].command === "D") {
            let replacementChar = input1Arr[changes[i].index]; //input1Arr[changes[i].index] == "" ? "&nbsp;" : input1Arr[changes[i].index];
            input1Arr[changes[i].index] = "<mark class=\"red\">" + replacementChar + "</mark>";
        }
    }
    
    if(mode === "character")
        input1Arr = input1Arr.join("");
    else if(mode === "word") {
        input1Arr = input1Arr.join(" ");
    }
    else if(mode === "line")
        input1Arr = input1Arr.join("\n");
        
    input1Arr = input1Arr.split("\n");

    console.log(input1Arr);
    
    document.getElementById("output").innerHTML = input1Arr.join('<br>');
    
}

document.getElementById("input1").addEventListener("change", compare);
document.getElementById("input2").addEventListener("change", compare);

document.getElementById("character").addEventListener("change", ()=>{ if(document.getElementById("character").checked) mode = "character"; compare();});
document.getElementById("word").addEventListener("change", ()=>{ if(document.getElementById("word").checked) mode = "word"; compare();});
document.getElementById("line").addEventListener("change", ()=>{ if(document.getElementById("line").checked) mode = "line"; compare();});

compare();