import generateQuestion from './Question.js'

export default class Spaceship {
  constructor(factor) {
    this.factor = factor
    // this.getNewQuestionAnswer()
    this.generateRandomSpeed()
  }

  generateRandomSpeed() {
    this.speed = Math.floor(Math.random() * 10) + this.factor / 10
  }

  getNewQuestionAnswer() {
    this.questionAnswer = generateQuestion()
  }
}
