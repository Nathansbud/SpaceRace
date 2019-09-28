const ce = document.querySelector("canvas")
const ctx = ce.getContext("2d", false)
const inputField = document.getElementById("text_input")

const livesText = document.getElementById("player_lives")
const scoreText = document.getElementById("player_score")

const pauseButton = document.getElementById("pause_button")

pieces = []
var timerRate = 1000;
var paused = false

const filledHeart = "❤️";
const emptyHeart = "🖤";

var counter = 10;
var spawnPiece = function() {
    //do something to timerRate
    pieces.push(new GamePiece(words[Math.floor(Math.random()*words.length)]))
    setTimeout(spawnPiece, timerRate);
}
setTimeout(spawnPiece, timerRate);

let words = [
    {
        "term":"Spanish",
        "answer":"sucks"
    },
    {
        "term":"Zack is",
        "answer":"sick"
    },
    {
        "term":"Sleep is",
        "answer":"desired"
    }
]

class Player {
    static lives = 3
    constructor() {
        this.score = 0
        this.lives = Player.lives
    }

    updateScore() {
        this.score += 10 
        scoreText.textContent = this.score
    }  

    loseLife() {
        player.lives -= 1
        livesText.textContent = this.getLivesText()
    }

    getLivesText() {
        return (this.lives >= 0) ? (filledHeart.repeat(this.lives) + emptyHeart.repeat(Player.lives - this.lives)) : (this.lives);
    }

}

player = new Player()

class GamePiece {
    static moveSpeed = 1.5
    static flipDefinition = false 
    static debug = false
    static width = 50
    static height = 50

    constructor(term) {
        this.term = (GamePiece.flipDefinition) ? (term['answer']) : (term['term'])
        this.answer = (GamePiece.flipDefinition) ? (term['term']) : (term['answer']) 
        
        this.width = GamePiece.width
        this.height = GamePiece.height
        
        this.x = 0 - this.width
        this.y = Math.random()*(ce.height - this.height)
    }
    
    draw() {
        ctx.fillStyle = "black"
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "white"
        ctx.fillText(this.term, this.x + this.width/2 - ctx.measureText(this.term).width/2, this.y + this.height/2)
    }

    score() {
        player.updateScore()
    }

    update() {
        if((this.x) > ce.width && !this.corrected && !GamePiece.debug) {
            let returned = prompt(`Enter the correct response, ${this.answer}:`, "") 
            if(returned != null) {
                switch(returned) {
                    case this.answer:
                        player.loseLife()
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
    setupUI()
    pieces.push(new GamePiece({"term":"Hi", "answer":"Heyo"}, 0, 0, 50, 50))

    setInterval(function() {
        draw();
    }, 10);

}

function updateBounds() {
    ce.width = window.innerWidth
    ce.height = window.innerHeight
}

function setupUI() {
    inputField.focus()
    inputField.addEventListener("keypress", function(event) {
        if(event.keyCode == 13) {
            pieces.forEach(piece => {
                if(piece.answer == inputField.value) piece.score()
            })
            pieces = pieces.filter(piece => piece.answer != inputField.value)
            inputField.value = ""
        }
    })
    livesText.textContent = player.getLivesText()
}

function clearCanvas() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); //Use identity matrix to ignore any transforms
    ctx.clearRect(0, 0, ce.width, ce.height);
}

pauseButton.addEventListener("click", function() {
    paused = !paused;
    
    pauseButton.textContent = (paused) ? ("Play") : ("Pause")
    if(paused) {
        inputField.setAttribute("disabled", true)
    } else {
        inputField.removeAttribute("disabled")
        inputField.focus()
    }
    //need to handle callback (spawn tiles) stuff with pause
})

function draw() {
    clearCanvas()
    for(piece of pieces) {
        piece.draw()
        if(!paused) piece.update()
    }
}

