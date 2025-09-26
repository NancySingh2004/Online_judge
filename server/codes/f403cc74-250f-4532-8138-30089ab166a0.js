const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];

rl.on('line', (line) => {
    lines.push(line);
    if (lines.length === 2) {
        const n = parseInt(lines[0]);
        const arr = lines[1].split(' ').map(Number);

        let maxSum = arr[0];
        let currentSum = arr[0];

        for (let i = 1; i < n; i++) {
            currentSum += arr[i];
            if (currentSum < arr[i]) currentSum = arr[i];
            maxSum = Math.max(maxSum, currentSum);
        }

        console.log(maxSum);
        rl.close();
    }
});
