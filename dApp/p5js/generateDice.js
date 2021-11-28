let pips = []
let dieFace = []
let diceAttr = []

const lowO = 0.25
const hiO = 0.75

function setup() {
    createCanvas(400, 400);
    rectMode(CENTER)
    ellipseMode(CENTER)


    pips.push({ x: width * lowO, y: height * lowO })
    pips.push({ x: width * .5, y: height * lowO })
    pips.push({ x: width * hiO, y: height * lowO })
    pips.push({ x: width * lowO, y: height * .5 })
    pips.push({ x: width * .5, y: height * .5 })
    pips.push({ x: width * hiO, y: height * .5 })
    pips.push({ x: width * lowO, y: height * hiO })
    pips.push({ x: width * .5, y: height * hiO })
    pips.push({ x: width * hiO, y: height * hiO })

    dieFace.push([4])
    dieFace.push([0, 8])
    dieFace.push([0, 4, 8])
    dieFace.push([0, 2, 6, 8])
    dieFace.push([0, 2, 4, 6, 8])
    dieFace.push([0, 2, 3, 5, 6, 8])

    diceAttr.push({ dieColor: 'red', pipColor: 'white', stroke: false })
    diceAttr.push({ dieColor: 'green', pipColor: 'white' })
    diceAttr.push({ dieColor: 'blue', pipColor: 'white' })
    diceAttr.push({ dieColor: 'yellow', pipColor: 'white', stroke: true })
    diceAttr.push({ dieColor: 'black', pipColor: 'white' })
    diceAttr.push({ dieColor: 'white', pipColor: 'black', stroke: true })

}

function draw() {
    background(0, 0)
    // strokeWeight(5)

    // drawDie(3, 5, true)
    drawDie(5, 5, false)
}

function drawPip(n) {
    circle(pips[n].x, pips[n].y, 80)
}

function drawDie(_color, n, _rounded) {
    (diceAttr[_color].stroke) ? strokeWeight(5) : noStroke()
    fill(diceAttr[_color].dieColor);
    (_rounded) ?
        rect(width / 2, height / 2, 400, 400, 40)
        : rect(width / 2, height / 2, 400, 400)
    fill(diceAttr[_color].pipColor)
    for (let i = 0; i < dieFace[n].length; i++) {
        drawPip(dieFace[n][i])
    }
}