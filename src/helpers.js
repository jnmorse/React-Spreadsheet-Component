const Helpers = {
  /**
   * Find the first element in an array matching a boolean
   * @param  {[array]} arr     [Array to test]
   * @param  {[function]} test [Test Function]
   * @param  {[type]} context  [Context]
   * @return {[object]}        [Found element]
   */
  firstInArray(arr, test, context) {
    let result = null

    arr.some((el, i) => {
      const comp = test.call(context, el, i, arr)
        ? ((result = el), true)
        : false

      return comp
    })

    return result
  },

  /**
   * Find the first TD in a path array
   * @param  {[array]} arr  [Path array containing elements]
   * @return {[object]}     [Found element]
   */
  firstTDinArray(arr) {
    const cell = Helpers.firstInArray(arr, element => {
      if (element.nodeName && element.nodeName === 'TD') {
        return true
      }
      return false
    })

    return cell
  },

  /**
   * Check if two cell objects reference the same cell
   * @param  {[array]} cell1 [First cell]
   * @param  {[array]} cell2 [Second cell]
   * @return {[boolean]}    [Boolean indicating if the cells are equal]
   */
  equalCells(cell1, cell2) {
    if (!cell1 || !cell2 || cell1.length !== cell2.length) {
      return false
    }

    if (cell1[0] === cell2[0] && cell1[1] === cell2[1]) {
      return true
    }
    return false
  },

  /**
   * Counts in letters (A, B, C...Z, AA);
   * @return {[string]} [Letter]
   */
  countWithLetters(num) {
    const mod = num % 26
    // eslint-disable-next-line no-bitwise
    let pow = (num / 26) | 0 // can't think of a better way to put this
    const out = mod ? String.fromCharCode(64 + mod) : ((pow -= 1), 'Z')
    return pow ? this.countWithLetters(pow) + out : out
  },

  /**
   * Creates a random 5-character id
   * @return {string} [Somewhat random id]
   */
  makeSpreadsheetId() {
    let text = ''
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 5; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
  }
}

module.exports = Helpers
