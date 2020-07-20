const generateQuestion = () => {
  const MAX_FIRST_NUM = 9
  const MAX_SECOND_NUM = 25
  const x = Math.floor((Math.random() * MAX_FIRST_NUM) + 1)
  const y = Math.floor((Math.random() * MAX_SECOND_NUM) + 1)
  const expression = `${x} + ${y}`

  return {
    question: expression,
    answer: eval(expression)
  }
}

export default generateQuestion
