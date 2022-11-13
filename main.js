//Called to make a move
function playCoin (column) {//return void
    //Check if column full
    if(coinsInColumn[column - 1] > 6){
        console.error(`Too many coins in column ${column}`);
        return;
    }
    
    //update the bitboard
    let row = coinsInColumn[column - 1];
    //console.log(`${row}`)
    if (currentTurn == 'red') {
        board.red = board.red | BigInt(toBitPosition(column, row));
    } else {
        board.blue = board.blue | BigInt(toBitPosition(column, row));
    }

    //create HTML coin element (displays coin for user)
    const coin = document.createElement("div");
    coin.classList.add("coin");
    coin.style.backgroundColor = "var(--" + currentTurn + ")";
    coin.style.gridRow = 6 - coinsInColumn[column - 1] + 1;
    coinsInColumn[column - 1] += 1;
    coin.style.gridColumn = column;
    
    //Prepares for next move
    togglePlayer();//alternate player
    addMoveHistory(column);//pushes move to history
    document.getElementById("board").appendChild(coin);
    let winState = checkWin(board);

    switch (winState) {
        case 1:
            //red wins
            console.log('red won!!!!!');
            break;
        case 2:
            //blue wins
            console.log('blue won!')
            break;
        case 3:
            //draw
            console.log('It is a draw!')
            break;
        default:
            break;
    }
}

//Converts column/row positiion to a number representing a bitboard position
function toBitPosition (column, row) {
    let bitVal = 0x000000000000001;
    bitVal = bitVal << (column - 1) * 8;
    bitVal = bitVal << row;
    return bitVal;
}

function undoLastMove () {

}

function addMoveHistory (column) {
    moveQueue.push(column);
}

//changes active player
function togglePlayer () {
    if (currentTurn == 'red') {
        currentTurn = 'blue';
        turnIndicator.innerHTML = "Yellows Turn";
    } else {
        currentTurn = 'red';
        turnIndicator.innerHTML = "Reds Turn";
    }
}

function checkWin (board) {
    if(findLongestChain(board.red) > 3)
    {
        return 1;
    }
    
    if(findLongestChain(board.blue) > 3)
    {
        return 2;
    }

    if((board.red | board.blue) == 0x000000001111111011111110111111101111111011111110111111101111111n )
    {
       return 3;
    }

    return 0;
}

function buttonHandler(e) {
    const button = e.target;
    let column = button.style.gridColumn;
    //console.log(`The buttons column is ${column}`);
    column = parseInt(column, 10)
    //console.log(`The buttons column is ${column}`);
    playCoin(column);
}

function findLongestChain(board) {
    const start = performance.now();
    let chain = 0;
    let longestChain = 0;
    for (let i = 0; i < 64; i++) {
        if(performance.now() - 500 > start) break;
        if ((board >> BigInt(i)) & 1n) {
            //check win |
            let j = 1;
            chain = 1;
            while((board >> BigInt(i + j)) & 1n) {
                if(performance.now() - 500 > start) break;
                j++;
                chain++;
                if (chain > 3) {
                    console.log(`Found | win at cell ${i}`);
                }
            }
            if (longestChain < chain) longestChain = chain;

            //check win /
            j = 7;
            chain = 1;
            while((board >> BigInt(i + j)) & 1n) {
                if(performance.now() - 500 > start) break;
                j += 7;
                chain++;
                if (chain > 3) {
                    console.log(`Found / win at cell ${i}`);
                }
            }

            //check win -
            j = 8;
            chain = 1;
            while((board >> BigInt(i + j)) & 1n) {
                if(performance.now() - 500 > start) break;
                j += 8;
                chain++;
                if (chain > 3) {
                    console.log(`Found - win at cell ${i}`);
                }
            }
            if(longestChain < chain) longestChain = chain;

            //check win \
            j = 9;
            chain = 1;
            while((board >> BigInt(i + j)) & 1n){
                if(performance.now() - 500 > start) break;
                j += 9;
                chain++;
                if (chain > 3) {
                    console.log(`Found \ win at cell ${i}`);
                }
            }
            if(longestChain < chain) longestChain = chain;
        }
    }
    return longestChain;
}


//Start of Execution
const button = document.getElementsByClassName('button');
const buttons = Array.from(button);
const turnIndicator = document.getElementById('turnIndicator')

let coinsInColumn = [0, 0, 0, 0, 0, 0, 0];
let moveQueue = [];
let board = {red: 0n, blue: 0n};
let currentTurn = 'red';

buttons.forEach(button => {
    button.addEventListener('click', buttonHandler);
})