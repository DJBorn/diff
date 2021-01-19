function diff(A, B) {
    // Create an array of objects, each object at index d represents all the farthest k distances at d. Initialize d = 0 as k = 0
    let V = [{0:0}],
        M = A.length,
        N = B.length,
        solutionFound = false,
        lastX, lastY, lastD,
        editScript = [],
        path = [];

    // Check for diagonals that occur at the very beginning 
    let i = 0;
    while(A[i] !== undefined && B[i] !== undefined && A[i] == B[i]) i++;
    V[0][0] = i;
    if(i >= M && i >= N) solutionFound = true;

    // Iterate through every possible d contour until a solution is found
    for(let d = 1; d <= M + N && !solutionFound; d++) {
        // Copy over preview k distances from previous d contour
        V[d] = {...V[d-1]};
        for(let k = -d; k <= d && !solutionFound; k += 2) {
            
            // Determine if k-1 has made it farther or k+1 has
            let kMinusOneDistance = V[d][k-1]*2 - (k-1);
            let kPlusOneDistance  = V[d][k+1]*2 - (k+1);

            // Move right if k reaches a new upper bound,
            // Move left if k reaches a new lower bound,
            // Move right if the k line below is farther/equal to the k line above
            let right = (d == k) || (d != -k && (kMinusOneDistance >= kPlusOneDistance));
            
            // Move right or down
            let endX = right ? V[d][k-1] + 1 : V[d][k+1];
            let endY = endX - k;
            
            // While there is a matching character, increase X and Y by 1
            while(A[endX] !== undefined && B[endY] !== undefined && A[endX] == B[endY]) { endX++; endY++ }

            // Record new k distance in V
            V[d][k] = endX;

            // If solution has been found (I.e. found M and N then store the final coordinates)
            if(endX >= M && endY >= N)  {
                solutionFound = true;
                lastX = endX;
                lastY = endY;
                lastD = d;
            }
        }
    }

    for(let d = lastD; d >= 0; d--) {
        // Determine k from the final X and Y found previously
        let k = lastX - lastY;

        // Determine if k-1 has made it farther or k+1 has
        let kMinusOneDistance = V[d][k-1]*2 - (k-1);
        let kPlusOneDistance  = V[d][k+1]*2 - (k+1);

        // Move right if k reaches a new upper bound,
        // Move left if k reaches a new lower bound,
        // Move right if the k line below is farther/equal to the k line above
        let right = (d == k) || (d != -k && (kMinusOneDistance >= kPlusOneDistance));

        // Find start coordinates of current snake
        let startX = right ? V[d][k-1] : V[d][k+1];
        let startY = startX - (right ? (k - 1) : (k + 1));

        // Add 1 to x or y if the origin coordinate is going down or left
        let midX = right ? startX + 1 : startX;
        let midY = right ? startY : startY + 1;

        path.unshift({
            startX,
            startY,
            midX,
            midY,
            lastX,
            lastY
        });

        // Set new snake endpoint to the start of the current snake
        lastX = startX;
        lastY = startY;
    }

    // Generate edit script based on the generated optimal path
    for(let i = 1; i < path.length; i++) {
        if(path[i].startX < path[i].midX && path[i].startY == path[i].midY)
            editScript.unshift({command: "D", index: path[i].startX});
        else if(path[i].startX == path[i].midX && path[i].startY < path[i].midY)
            editScript.unshift({command: "I", insertIndex: path[i].startX, sourceIndex: path[i].startY})
    }
    return editScript;
}