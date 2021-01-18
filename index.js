

function diff() {
    let input1 = document.getElementById("input1").value;
    let input2 = document.getElementById("input2").value;
    
    let input1Arr = input1.split("");
    
    let changes = Diff.diff(input1, input2);
    console.log(changes);
    
    for(let i = 0; i < changes.length; i++) {
        if(changes[i].command === "I") {
            input1Arr.splice(changes[i].insertIndex, 0, "<mark class=\"green\">" + input2[changes[i].sourceIndex] + "</mark>");
        }
        if(changes[i].command === "D") {
            input1Arr[changes[i].index] = "<mark class=\"red\"><s>" + input1Arr[changes[i].index] + "</s></mark>";
        }
    }
    
    console.log(input1Arr);
    document.getElementById("output").innerHTML = input1Arr.join('');
    
}

document.getElementById("input1").addEventListener("change", diff);
document.getElementById("input2").addEventListener("change", diff);

diff();