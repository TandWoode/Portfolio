"use strict";
//Declares global variables to be used in various functions
let ctx;
let pX;
let pY;
//numArray
let numArray = new Array(1,2,3,4,5,6,7,8,9);
//boxArray is used to create the box objects, it holds info such as the pixel coordinates,
//the x y coordinates, which block of 9 the object is in, and the top and side coordinates
//that the object is in within the block of 9
let boxArray = [];

function setup() {
    let canvas = document.getElementById("sudokuGrid");
    ctx=canvas.getContext("2d");
    addBoxes();
    draw();
    canvas.addEventListener ("click",function(event) {
		pX = event.offsetX;
        pY = event.offsetY;
        addNumber();
        draw();
    });
}

function draw() {
    ctx.clearRect(0,0,450,450);
    drawGrid();
    drawNumber();
    displayP();
}

function drawGrid() {
    ctx.save();
    for(let i = 0; i<8; i++) {
        let p = i*50+50;
        ctx.beginPath();
        ctx.lineTo(p,0);
        ctx.lineTo(p,450);
        ctx.moveTo(0,p);
        ctx.lineTo(450,p);
        if(p % 150 == 0) {
            ctx.save();
            ctx.strokeStyle = "red";
        }
        ctx.stroke();
        ctx.restore();
    }
    ctx.restore(); 
}

function BoxNumbersObject(x,y,topN,sideN,squareN) {
    this.x = x;
    this.y = y;
    this.topN = topN;
    this.sideN = sideN;
    this.squareN = squareN;
    this.blockT = 0;
    this.blockS = 0;
    this.nums = numArray.slice();
}

function addBoxes() {
    for(let i=0; i<9; i++) {
        let bY = i*50+25;
        for (let ii=0; ii<9; ii++) {
            let bX = ii*50+25;
            let topN = 1+ii;
            let sideN = i+1;
            let squareN = 0;
            
            boxArray.push(new BoxNumbersObject(bX,bY,topN,sideN,squareN));
        }
    }
    assignBlock();
    assignInBlockXY();
}

function assignBlock() {
    for(let i = 0; i<boxArray.length; i++) {
        let c = boxArray[i];
        if(c.topN == 1 || c.topN == 2 || c.topN == 3) {
            if(c.sideN == 1 || c.sideN == 2 || c.sideN == 3) {
                c.squareN = 1;
            } else if(c.sideN == 4 || c.sideN == 5 || c.sideN == 6) {
                c.squareN = 4;
            } else if(c.sideN == 7 || c.sideN == 8 || c.sideN == 9) {
                c.squareN = 7;
            }
        } else if(c.topN == 4 || c.topN == 5 || c.topN == 6) {
            if(c.sideN == 1 || c.sideN == 2 || c.sideN == 3) {
                c.squareN = 2;
            } else if(c.sideN == 4 || c.sideN == 5 || c.sideN == 6) {
                c.squareN = 5;
            } else if(c.sideN == 7 || c.sideN == 8 || c.sideN == 9) {
                c.squareN = 8;
            }
        } else if(c.topN == 7 || c.topN == 8 || c.topN == 9) {
            if(c.sideN == 1 || c.sideN == 2 || c.sideN == 3) {
                c.squareN = 3;
            } else if(c.sideN == 4 || c.sideN == 5 || c.sideN == 6) {
                c.squareN = 6;
            } else if(c.sideN == 7 || c.sideN == 8 || c.sideN == 9) {
                c.squareN = 9;
            }
        }
    }
}

function assignInBlockXY() {
    for(let i = 0; i < 9; i++) {
        let blockT = 1;
        let blockS = 1;
        for(let ii = 0; ii < boxArray.length; ii++) {
            let c = boxArray[ii];
            if(c.squareN == 1 + i) {
                c.blockT = blockT;
                c.blockS = blockS;
                blockT += 1;
            }
            if (blockT == 4) {
                blockT = 1;
                blockS += 1;
            }
        }
    }
}

function addNumber() {
    for(let i=0; i<boxArray.length; i++) {
        let c = boxArray[i];
        if(Math.sqrt((c.x-pX)**2 + (c.y-pY)**2) < 25) {
            let uN = Math.round(+prompt("Enter the number that goes here."));
            while(isNaN(uN) || uN < 0 || uN > 9) {
                uN = Math.round(+prompt("Enter a Valid Number between 1 and 9."));
            }
            if(uN > 0) {
                c.nums.splice(0,9);
            }
            c.nums.push(uN);
        }
    }
}

function drawNumber() {
    for(let i=0; i<boxArray.length; i++) {
        let c = boxArray[i];
        if(c.nums.length == 1) {
            ctx.save();
            ctx.font = "50px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(c.nums[0], c.x, c.y + 20);
            ctx.restore();
        }
    }
    /*ctx.save();
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("1", 25, 500);
    ctx.fillText("2", 75, 500);
    ctx.fillText("3", 125, 500);
    ctx.fillText("4", 175, 500);
    ctx.fillText("5", 225, 500);
    ctx.fillText("6", 275, 500);
    ctx.fillText("7", 325, 500);
    ctx.fillText("8", 375, 500);
    ctx.fillText("9", 425, 500);
    ctx.fillText("1", 475,50);
    ctx.fillText("2", 475,100);
    ctx.fillText("3", 475,150);
    ctx.fillText("4", 475,200);
    ctx.fillText("5", 475,250);
    ctx.fillText("6", 475,300);
    ctx.fillText("7", 475,350);
    ctx.fillText("8", 475,400);
    ctx.fillText("9", 475,450);
    ctx.restore();*/
}
//everything above this is basically just graphical
//or creates all the boxes and their possibilities
//c is active array, c2 is the compared array
//this function reduces the possibilities based on what is already filled
function reduce() {
    for(let i = 0; i < boxArray.length; i++) {
        let c = boxArray[i];
        if(c.nums.length > 1) {
            for(let ii = 0; ii<boxArray.length; ii++) {
                let c2 = boxArray[ii];
                if(c.squareN == c2.squareN) {
                    let cN = c.nums;
                    if(c2.nums.length == 1) {
                        let c2N = c2.nums[0];
                        for(let iii = 0; iii < cN.length; iii++) {
                            if(cN.length == 1) {
                            } else if(cN[iii] == c2N) {
                                cN.splice(iii,1);
                            }
                        }
                    }
                }
                if(c.topN == c2.topN) {
                    let cN = c.nums;
                    if(c2.nums.length == 1) {
                        let c2N = c2.nums[0];
                        for(let iii = 0; iii < cN.length; iii++) {
                            if(cN.length == 1) {
                            } else if(cN[iii] == c2N) {
                                cN.splice(iii,1);
                            }
                        }
                    }
                }
                if(c.sideN == c2.sideN) {
                    let cN = c.nums;
                    if(c2.nums.length == 1) {
                        let c2N = c2.nums[0];
                        for(let iii = 0; iii < cN.length; iii++) {
                            if(cN.length == 1) {
                            } else if(cN[iii] == c2N) {
                                cN.splice(iii,1);
                            }
                        }
                    }
                }
            }
        }
    }
    draw();
}
//these are buttons that add test puzzles, so I dont have to manually type them everytime
function hardTest() {
    boxArray[0].nums = [1];
    boxArray[2].nums = [8];
    boxArray[8].nums = [5];
    boxArray[16].nums = [2];
    boxArray[21].nums = [4];
    boxArray[23].nums = [3];
    boxArray[25].nums = [9];
    boxArray[27].nums = [7];
    boxArray[28].nums = [2];
    boxArray[31].nums = [6];
    boxArray[32].nums = [8];
    boxArray[38].nums = [9];
    boxArray[42].nums = [6];
    boxArray[48].nums = [1];
    boxArray[55].nums = [3];
    boxArray[60].nums = [4];
    boxArray[63].nums = [8];
    boxArray[64].nums = [9];
    boxArray[66].nums = [7];
    boxArray[75].nums = [2];
    boxArray[76].nums = [1];
    boxArray[78].nums = [5];
    draw();
}
//Another test puzzle, auto add
function easyTest() {
    boxArray[3].nums = [9];
    boxArray[5].nums = [2];
    boxArray[6].nums = [7];
    boxArray[7].nums = [3];
    boxArray[8].nums = [8];
    boxArray[10].nums = [6];
    boxArray[14].nums = [5];
    boxArray[17].nums = [9];
    boxArray[18].nums = [8];
    boxArray[19].nums = [2];
    boxArray[20].nums = [9];
    boxArray[21].nums = [3];
    boxArray[24].nums = [6];
    boxArray[26].nums = [1];
    boxArray[29].nums = [1];
    boxArray[32].nums = [6];
    boxArray[34].nums = [8];
    boxArray[35].nums = [2];
    boxArray[37].nums = [9];
    boxArray[38].nums = [3];
    boxArray[40].nums = [1];
    boxArray[42].nums = [4];
    boxArray[44].nums = [5];
    boxArray[46].nums = [8];
    boxArray[48].nums = [7];
    boxArray[51].nums = [9];
    boxArray[52].nums = [1];
    boxArray[54].nums = [9];
    boxArray[59].nums = [7];
    boxArray[64].nums = [3];
    boxArray[65].nums = [8];
    boxArray[66].nums = [6];
    boxArray[69].nums = [5];
    boxArray[75].nums = [5];
    boxArray[77].nums = [1];
    boxArray[78].nums = [8];
    boxArray[79].nums = [9];
    boxArray[80].nums = [4];
    draw();
}
//This function draws all of the possible numbers within a square
function displayP() {
    for(let i = 0; i < boxArray.length; i++) {
        let aB = boxArray[i];
        if(aB.nums.length != 1) {
            for(let ii = 0; ii < aB.nums.length; ii++) {
                let n = aB.nums[ii];
                let x = aB.x;
                let y = aB.y;
                let nX = 0;
                let nY = 0;
                ctx.save();
                ctx.translate(x,y);
                ctx.translate(-25,-25);
                ctx.font = "10px Arial";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                if(n == 1) {
                    nX = 10;
                    nY = 10;
                } else if(n == 2) {
                    nX = 25;
                    nY = 10;
                } else if(n == 3) {
                    nX = 40;
                    nY = 10;
                } else if(n == 4) {
                    nX = 10;
                    nY = 25;
                } else if(n == 5) {
                    nX = 25;
                    nY = 25;
                } else if(n == 6) {
                    nX = 40;
                    nY = 25;
                } else if(n == 7) {
                    nX = 10;
                    nY = 40;
                } else if(n == 8) {
                    nX = 25;
                    nY = 40;
                } else if(n == 9) {
                    nX = 40;
                    nY = 40;
                }
                ctx.fillText(n, nX, nY);
                ctx.restore();
            }
        }
    }
}
//this checks each possible number in each box, and compares all possible
//numbers in alignment to see if there are copies or not of the possible number
//if this is the only place for a number, it will be drawn
function checkPAlignment() {
    for(let i = 0; i < boxArray.length; i++) {
        let aB = boxArray[i];
        if(aB.nums.length != 1) {
            let aBC = [];
            for(let ii = 0; ii < aB.nums.length; ii++) {
                let aN = aB.nums.slice(ii,ii+1);
                let siCount = 0;
                let sqCount = 0;
                let tCount = 0;
                for(let iii = 0; iii < boxArray.length; iii++) {
                    let cB = boxArray[iii];
                    if(aB != cB) {
                        if (aB.sideN == cB.sideN) {
                            for(let iv = 0; iv < cB.nums.length; iv++) {
                                let cBN = cB.nums[iv];
                                if(aN == cBN) {
                                    siCount += 1;
                                }
                            }
                        }
                        if (aB.squareN == cB.squareN) {
                            for(let iv = 0; iv < cB.nums.length; iv++) {
                                let cBN = cB.nums[iv];
                                if(aN == cBN) {
                                    sqCount += 1;
                                }
                            }
                        }
                        if (aB.topN == cB.topN) {
                            for(let iv = 0; iv < cB.nums.length; iv++) {
                                let cBN = cB.nums[iv];
                                if(aN == cBN) {
                                    tCount += 1;
                                }
                            }
                        }
                    }
                }
                aBC.push([aN,siCount,sqCount,tCount]);
            }

            for(let ii = 0; ii < aBC.length; ii++) {
                let aN = aBC[ii][0];
                let aSi = aBC[ii][1];
                let aSq = aBC[ii][2];
                let aT = aBC[ii][3];
                if(aSi == 0 || aSq == 0 || aT == 0) {
                    aB.nums = [aN];
                }
            }
        }
    }
    reduce();
}
//this function reduces the possibilities in each square
//by looking in each block for side-by-side possibile answers where there are only 2
//if there are ONLY 2 of the same possible number side-by-side
//that number is taken out of all other squares that align with the double number
function checkSquarePAlignment() {
    for(let i = 0; i < boxArray.length; i++) {
        let aB = boxArray[i];
        let pCA = [];
        if(aB.nums.length != 1) {
            for(let ii = 0; ii < aB.nums.length; ii++) {
                let aN = aB.nums[ii];
                let sqC = 0;
                let siC = 0;
                let tC = 0;
                for(let iii = 0; iii < boxArray.length; iii++) {
                    let cB = boxArray[iii];
                    if(aB.squareN == cB.squareN) {
                        for(let iv = 0; iv < cB.nums.length; iv++) {
                            let cN = cB.nums[iv];
                            if(aN == cN) {
                                sqC+=1;
                            }
                        }
                    }
                    if(aB.sideN == cB.sideN && aB.squareN == cB.squareN) {
                        for(let iv = 0; iv < cB.nums.length; iv++) {
                            let cN = cB.nums[iv];
                            if(aN == cN) {
                                siC+=1;
                            }
                        }
                    }
                    if(aB.topN == cB.topN && aB.squareN == cB.squareN) {
                        for(let iv = 0; iv < cB.nums.length; iv++) {
                            let cN = cB.nums[iv];
                            if(aN == cN) {
                                tC+=1;
                            }
                        }
                    }
                }
                pCA.push([aN,sqC,siC,tC]);
            }
        }
        for(let i = 0; i < pCA.length; i++) {
            let n = pCA[i][0];
            let sq = pCA[i][1];
            let si = pCA[i][2];
            let t = pCA[i][3];
            if(sq == si) {
                for(let ii = 0; ii < boxArray.length; ii++) {
                    let cB = boxArray[ii];
                    if(cB.nums.length != 1) {
                        if(aB.squareN != cB.squareN && aB.sideN == cB.sideN) {
                            for(let iii = 0; iii < cB.nums.length; iii++) {
                                let cBN = cB.nums[iii];
                                if(cBN == n) {
                                    cB.nums.splice(iii,1);
                                    break;
                                }
                            }
                        }
                    }

                }
            }
            if(sq == t) {
                for(let ii = 0; ii < boxArray.length; ii++) {
                    let cB = boxArray[ii];
                    if(cB.nums.length != 1) {
                        if(aB.squareN != cB.squareN && aB.topN == cB.topN) {
                            for(let iii = 0; iii < cB.nums.length; iii++) {
                                let cBN = cB.nums[iii];
                                if(cBN == n) {
                                    cB.nums.splice(iii,1);
                                    break;
                                }
                            }
                        }
                    }

                }
            }
        }
    }
    reduce();
}



function solveSudoku() {
    reduce();
    checkSquarePAlignment();
    checkPAlignment();
    draw();
}