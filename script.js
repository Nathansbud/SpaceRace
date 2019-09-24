const ce = document.querySelector("canvas")
const ctx = ce.getContext("2d", false)

class Player {
    static lives = 3

    constructor() {
        this.score = 0
        this.lives = Player.lives
    }
}

player = new Player()

class GamePiece {
    static moveSpeed = 10
    static flipDefinition = false 


    constructor(term, x, y, w, h) {
        this.term = (GamePiece.flipDefinition) ? (term['answer']) : (term['term'])
        this.answer = (GamePiece.flipDefinition) ? (term['term']) : (term['answer'])
        
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.corrected = false
    }

    draw() {
        ctx.fillStyle = "black"
        ctx.fillRect(this.x, this.y, this.w, this.h)
        ctx.fillStyle = "white"
        ctx.fillText(this.term, this.x + this.w/2 - ctx.measureText(this.term).width/2, this.y + this.h/2)
    }

    update() {
        if((this.x) > ce.width && !this.corrected) {
            let returned = prompt(`Enter the correct response, ${this.answer}:`, "") 
            if(returned != null) {
                switch(returned) {
                    case this.answer:
                        player.lives -= 1
                        this.corrected = true
                        break;
                    default:
                        if(!this.corrected) returned = prompt(`Enter the correct response, ${this.answer}:`, "")
                        break;

                }
            }
        } else {
            this.x += GamePiece.moveSpeed
        }
    }
}


window.onload = function(){
    updateBounds();
    setInterval(function() {
        draw();
    }, 10);
}

function updateBounds() {
    ce.width = window.innerWidth
    ce.height = window.innerHeight
}

g = new GamePiece({
    "term":"Heyo",
    "answer":"Hi"
}, 20, 20, 40, 20)

function draw() {
    clearCanvas()
    g.draw()
    g.update()
    ctx.fillStyle = 'black'
    ctx.fillText(player.lives, ce.width/2, ce.height/2)  
}

function clearCanvas() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); //Use identity matrix to ignore any transforms
    ctx.clearRect(0, 0, ce.width, ce.height);
}