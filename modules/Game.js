import Spaceship from './Spaceship.js'

export class Game {
  constructor (difficulty) {
    this.difficulty = difficulty
    this.currentCannonPos = 1
    this.hitCount = 0
    this.missCount = 0
    this.spaceships = []
    for (let i = 0; i < 5; i++) {
      this.spaceships.push(new Spaceship(this.GET_FACTOR()))
    }
    this.refreshQuestions()
    this.setAnswerIndex()
  }

  CANNON_POS_MIN () { return 1 }
  CANNON_POS_MAX () { return 5 }
  GET_FACTOR () { return this.difficulty === 'easy' ? 10 : 100 }

  updateScore () {
    if (this.checkAnswer()) {
      this.hitCount++
    } else {
      this.missCount++
    }
  }

  moveCannonLeft () {
    if (this.currentCannonPos > this.CANNON_POS_MIN()) {
      this.currentCannonPos--
    }
  }

  moveCannonRight () {
    if (this.currentCannonPos < this.CANNON_POS_MAX()) {
      this.currentCannonPos++
    }
  }

  getCannonPos () {
    return this.currentCannonPos
  }

  refreshQuestions () {
    // TODO: generate UNIQUE ANSWERS
    this.spaceships.forEach((spaceship, i) => {
      spaceship.getNewQuestionAnswer()
      let j = 0
      while (j < i) {
        const currentQuestionVal = spaceship.questionAnswer.question.split(' + ')
        const otherQuestionVal = this.spaceships[j].questionAnswer.question.split(' + ')
        if (spaceship.questionAnswer.answer === this.spaceships[j].questionAnswer.answer
          || currentQuestionVal.sort() === otherQuestionVal.sort()) {
          // answer cannot be the same, regenerate && question cannot contain the same values
          spaceship.getNewQuestionAnswer()
        } else {
          j++
        }
      }
    })
    this.setAnswerIndex()
  }

  setAnswerIndex () {
    this.answerIndex = Math.floor(Math.random() * 5)
  }

  getAnswer () {
    return this.spaceships[this.answerIndex].questionAnswer.answer
  }

  checkAnswer () {
    return this.answerIndex === this.getCannonPos() - 1
  }
}
