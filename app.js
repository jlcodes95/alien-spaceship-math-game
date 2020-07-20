import {Game} from './modules/Game.js'

const IMG_SOUND_ENABLE = 'assets/icons/icon_sound.png'
const IMG_SOUND_DISABLE = 'assets/icons/icon_mute.png'
const KEY_SAVE = 'alien-invasion-math-game-save'
const DIV_DEFAULT = '#div-menu-default'
const DIV_RULES = '#div-menu-rules'
const DIV_GAME = '#div-menu-game'
const MAX_MARGIN_CANNON = 518
const MAX_MARGIN_PLATFORM = 610
const DEFAULT_TIME = 90

let currentGameStep = 0
let soundOn = false
let currentGame = null
let name
let difficulty
let timer
let currentTime = DEFAULT_TIME
let steps = 0
let gameOver = false

const onStartClick = () => {
  currentGameStep++
  setMenuDivVisible(DIV_GAME)
}

const onRulesClick = () => {
  setMenuDivVisible(DIV_RULES)
}

const onBackClick = () => {
  setMenuDivVisible(DIV_DEFAULT)
}

const onSoundClick = () => {
  const images = document.querySelectorAll('.btn-sound > img')
  soundOn = !soundOn
  images.forEach((image, i) => {
    image.src.includes(IMG_SOUND_ENABLE) ? image.src = IMG_SOUND_DISABLE : image.src = IMG_SOUND_ENABLE
  })

  if (soundOn) {
    playAudio()
  } else {
    pauseAudio()
  }
}

const setMenuDivVisible = (divId = null) => {
  const divArray = document.querySelectorAll('.div-menu')
  for (let i = 0; i < divArray.length; i++) {
    divArray[i].setAttribute('hidden', true)
  }

  if (divId != null) {
    document.querySelector(divId).removeAttribute('hidden')
  }
}

const resetGame = () => {
  currentGameStep = 0
  setMenuDivVisible()
  hideTitle()
  document.querySelector('#container-menu').style.display = 'none'
  document.querySelector('#container-game').style.display = 'grid'
  document.querySelector('#container-game-elements').style.display = 'grid'
  document.querySelector('#container-game-hud').style.display = 'grid'
  document.querySelector('#game-over-dialog').setAttribute('hidden', true)
  document.querySelector('#cannon').style.gridColumn = 1
  currentGame = new Game(difficulty)
  steps = 0
  currentTime = DEFAULT_TIME
  updateGameUI(true)

  // start spaceship movement
  timer = setInterval(startTimer, 1000)
}

const backToMenu = () => {
  document.querySelector('#title').removeAttribute('hidden')
  document.querySelector('#container-menu').style.display = 'block'
  document.querySelector('#container-game').style.display = 'none'
  document.querySelector('#container-game-elements').style.display = 'none'
  document.querySelector('#container-game-hud').style.display = 'none'
  document.querySelector('#game-over-dialog').setAttribute('hidden', true)
  document.querySelector('#game-step-1').removeAttribute('hidden')
  document.querySelector('#game-step-1').setAttribute('hidden', true)
  currentGameStep = 0
  onBackClick()
}

const promptGameOver = () => {
  // display details...
  document.querySelector('#sum-player-name').innerText = name
  document.querySelector('#sum-difficulty').innerText = difficulty
  document.querySelector('#sum-hit-count').innerText = currentGame.hitCount
  document.querySelector('#sum-miss-count').innerText = currentGame.missCount
  document.querySelector('#game-over-dialog').removeAttribute('hidden')
}

const detectSpaceshipCollision = () => {
  const spaceship = document.querySelectorAll('.div-spaceship')[currentGame.getCannonPos() - 1]
  return Number(spaceship.style.marginTop.replace('px', '')) >= MAX_MARGIN_CANNON
}

const startTimer = () => {
  document.querySelector('#timer-text').innerText = currentTime
  document.querySelectorAll('.div-spaceship').forEach((spaceship, i) => {
    const margin = steps * currentGame.spaceships[i].speed
    spaceship.style.marginTop = `${margin}px`
    if (margin >= MAX_MARGIN_PLATFORM || (margin >= MAX_MARGIN_CANNON && i === currentGame.getCannonPos() - 1)) {
      clearInterval(timer)
      promptGameOver()
    } else {
      steps++
    }
  })
  if (currentTime === 0) {
    clearInterval(timer)
    promptGameOver()
  }
  currentTime--
}

const updateGameUI = (resetToTop) => {
  if (resetToTop) {
    steps = 0

    // reset spaceship position
    document.querySelectorAll('.div-spaceship').forEach((spaceship, i) => {
      spaceship.style.marginTop = '0px'
    })
  }

  // set spaceship questions
  document.querySelectorAll('.question').forEach((question, i) => {
    question.innerText = currentGame.spaceships[i].questionAnswer.question
  })

  // set cannon answer
  document.querySelector('#answer').innerText = currentGame.getAnswer()

  // update score
  document.querySelector('#hit-text').innerText = currentGame.hitCount
  document.querySelector('#miss-text').innerText = currentGame.missCount
}

const onStepBackClick = () => {
  currentGameStep--
  if (currentGameStep == 0) {
    onBackClick()
  } else {
    setStepVisible()
  }
}

const onNextClick = () => {
  if (currentGameStep > 1) {
    // set difficulty
    difficulty = document.querySelector('#easy').checked ? document.querySelector('#easy').value : document.querySelector('#hard').value

    resetGame()
  } else {
    // second step
    const input = document.querySelector('#game-step-1')
    if (input.value === '') {
      console.log('please enter name')
    } else {
      name = input.value
      currentGameStep++
      setStepVisible()
    }
  }
}

const setStepVisible = () => {
  const stepArray = document.querySelectorAll('.game-step')
  for (let i = 0; i < stepArray.length; i++) {
    stepArray[i].setAttribute('hidden', true)
  }
  const stepName = '#game-step-' + currentGameStep
  document.querySelector(stepName).removeAttribute('hidden')
}

const hideTitle = () => {
  document.querySelector('#title').setAttribute('hidden', true)
}

const playAudio = () => {
  const audio = document.querySelector('#bkg')
  audio.play()
}

const pauseAudio = () => {
  document.querySelector('#bkg').pause()
}

const onSaveClick = () => {
  let data = {}
  data.name = name
  data.difficulty = difficulty
  data.spaceshipQuestions = currentGame.spaceships.map(spaceship => spaceship.questionAnswer.question)
  data.cannonAnswer = currentGame.getAnswer()
  data.hitCount = currentGame.hitCount
  data.missCount = currentGame.missCount
  data.timeRemaining = currentTime

  window.localStorage.setItem(KEY_SAVE, JSON.stringify(data))
  window.alert('saved!')
}

const attachHandlers = () => {
  document.querySelector('#bkg').volume = 0.1
  document.querySelector('#btn-start').addEventListener('click', onStartClick)
  document.querySelector('#btn-rules').addEventListener('click', onRulesClick)
  document.querySelector('#btn-back').addEventListener('click', onBackClick)
  document.querySelector('#btn-next').addEventListener('click', onNextClick)
  // document.querySelector('#btn-sound').addEventListener('click', onSoundClick)
  document.querySelector('#btn-back-step').addEventListener('click', onStepBackClick)
  document.querySelector('#btn-restart').addEventListener('click', resetGame)
  document.querySelector('#btn-menu').addEventListener('click', backToMenu)
  document.querySelector('#btn-hud-save').addEventListener('click', onSaveClick)
  document.querySelectorAll('.btn-sound').forEach((button, i) => {
    button.addEventListener('click', onSoundClick)
  })

  document.addEventListener('keydown', (event) => {
    if (currentGame != null && currentTime > 0 && !gameOver) {
      if (event.key == 'ArrowRight') {
        currentGame.moveCannonRight()
        cannon.style.gridColumn = currentGame.getCannonPos()
      } else if (event.key == 'ArrowLeft') {
        currentGame.moveCannonLeft()
        cannon.style.gridColumn = currentGame.getCannonPos()
      } else if (event.key == ' ') {
        const correct = currentGame.checkAnswer()
          // refresh question & UI
        currentGame.updateScore()
        currentGame.refreshQuestions()
        updateGameUI(correct)
      }
      if (detectSpaceshipCollision()) {
        clearInterval(timer)
        promptGameOver()
      }
    }
  })
}

attachHandlers()
