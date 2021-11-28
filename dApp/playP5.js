const animSpeed = 15
const offset = 0.28
const sz = 125

let pips = []
let dieFace = []
let diceAttr = []
let frameOffset = 0
let dColor = [1, 1, 1, 1, 1]
let rollingResults = [5, 5, 5, 5, 5]

// p5js setup function
function setup() {
    let canvas = createCanvas(800, 300)
    canvas.parent('diceResultsP5js')
    rectMode(CENTER)
    ellipseMode(CENTER)

    // define pips
    pips.push({ x: -sz * offset, y: -sz * offset })
    pips.push({ x: 0, y: -sz * offset })
    pips.push({ x: sz * offset, y: -sz * offset })
    pips.push({ x: -sz * offset, y: 0 })
    pips.push({ x: 0, y: 0 })
    pips.push({ x: sz * offset, y: 0 })
    pips.push({ x: -sz * offset, y: sz * offset })
    pips.push({ x: 0, y: sz * offset })
    pips.push({ x: sz * offset, y: sz * offset })

    // define die result (1-6) to pip mapping
    dieFace.push([4])
    dieFace.push([0, 8])
    dieFace.push([0, 4, 8])
    dieFace.push([0, 2, 6, 8])
    dieFace.push([0, 2, 4, 6, 8])
    dieFace.push([0, 2, 3, 5, 6, 8])
    // dieFace.push([0, 1, 2, 3, 4, 5, 6, 7, 8])

    // define the look of the individual dice
    diceAttr.push({ dieColor: 'red', pipColor: 'white', stroke: false })
    diceAttr.push({ dieColor: 'green', pipColor: 'white' })
    diceAttr.push({ dieColor: 'blue', pipColor: 'white' })
    diceAttr.push({ dieColor: 'yellow', pipColor: 'white', stroke: true })
    diceAttr.push({ dieColor: 'black', pipColor: 'white' })
    diceAttr.push({ dieColor: 'white', pipColor: 'black', stroke: true })
}

// p5js draw loop
function draw() {
    if (state == 'ready') {
        pp5Ready()
    } else if (state == 'waiting') {
        pp5Waiting()
    }
    // else if (state == 'rolling') {
    // pp5Rolling()
    // }
    // else if (state == 'base') {
    //     pp5Base()
    // }
}


function pp5Ready() {
    background('green')
    push()
    translate(100, height / 2)
    for (let x = 0; x < 5; x++) {
        drawDie(x * 150, 0, dColor[x], diceResults[x] - 1, true)
    }
    pop()

}

function pp5Waiting() {
    background('green')
    frameOffset++
    push()
    translate(100, height / 2)
    for (let x = 0; x < 5; x++) {
        if (frameOffset == animSpeed) {
            rollingResults[x] = Math.floor(random(6))
        }
        drawDie(x * 150, 0, dColor[x], rollingResults[x], true)
    }
    pop()
    if (frameOffset > animSpeed)
        frameOffset = 0
}

// function pp5Base() {
//     background('gray')
// }


// function pp5Rolling() {
//     background('gray')
// }


function drawPip(n) {
    circle(pips[n].x, pips[n].y, sz * .2)
}

function drawDie(x, y, _color, n, _rounded) {
    push()
    translate(x, y)
    stroke(0)
    strokeWeight(5)
    fill(diceAttr[_color].dieColor);

    (_rounded) ?
        rect(0, 0, sz, sz, sz * .1)
        : rect(0, 0, sz, sz);
    (diceAttr[_color].stroke) ? strokeWeight(5) : noStroke();
    fill(diceAttr[_color].pipColor)

    for (let i = 0; i < dieFace[n].length; i++) {
        drawPip(dieFace[n][i])
    }
    pop()
}

function randomizeDiceSelection() {
    // console.log(`In randomizeDiceSelection ${accountBalances}`)

    // Create an array to represent the total dice collection
    let diceOwned = []
    for (let x = 1; x < accountBalances.length; x++) {
        // console.log(`${x}: ${accountBalances[x]}`)
        for (let y = 0; y < accountBalances[x]; y++) {
            diceOwned.push(x)
        }
    }
    // console.log(diceOwned)

    // Randomly shuffle diceOwned in place
    let swapInd
    let tmp
    for (let i = (diceOwned.length - 1); i > 0; i--) {
        swapInd = Math.floor(Math.random() * i);
        tmp = diceOwned[i];
        diceOwned[i] = diceOwned[swapInd];
        diceOwned[swapInd] = tmp;
    }
    // console.log(diceOwned)

    // Pick the first 5 dice from the shuffled array
    for (let x = 0; x < 5; x++) {
        dColor[x] = diceOwned[x] - 1
    }

}
