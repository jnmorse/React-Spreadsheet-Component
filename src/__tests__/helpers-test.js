jest.dontMock('../helpers')

const Helpers = require('../helpers')

describe('Helpers', () => {
  it('Correctly finds the first element in an array', () => {
    const arr = [
      { myProp: 1 },
      { myProp: 2 },
      { myProp: 3, xProp: 1 },
      { myProp: 4 },
      { myProp: 3, xProp: 2 }
    ]

    const firstFound = Helpers.firstInArray(arr, element => {
      return element.myProp === 3
    })

    expect(firstFound.myProp).toBe(3)
    expect(firstFound.xProp).toBe(1)
  })

  it('Correctly finds the first element in an array', () => {
    const arr = [
      { nodeName: 'x' },
      { nodeName: 'TD', myProp: 1 },
      { nodeName: 'TD', myProp: 2 }
    ]

    const firstFound = Helpers.firstTDinArray(arr)

    expect(firstFound.nodeName).toBe('TD')
    expect(firstFound.myProp).toBe(1)
  })

  it('Correctly identifies two cells as equal', () => {
    const cell1 = ['prop', 'propTwo']
    const cell2 = ['prop', 'propTwo']

    const cellsEqual = Helpers.equalCells(cell1, cell2)

    expect(cellsEqual).toBe(true)
  })

  it('Correctly identifies two cells as unequal', () => {
    const cell1 = ['prop', 'propTwo']
    const cell2 = ['prop', 'propThree']

    const cellsEqual = Helpers.equalCells(cell1, cell2)

    expect(cellsEqual).toBe(false)
  })

  it('Correctly counts with letters', () => {
    expect(Helpers.countWithLetters(1)).toBe('A')
    expect(Helpers.countWithLetters(2)).toBe('B')
    expect(Helpers.countWithLetters(26)).toBe('Z')
    expect(Helpers.countWithLetters(27)).toBe('AA')
    expect(Helpers.countWithLetters(28)).toBe('AB')
  })

  it('Correctly makes a spreadsheet id', () => {
    expect(Helpers.makeSpreadsheetId().length).toBe(5)
    expect(Helpers.makeSpreadsheetId().length).toBe(5)
    expect(Helpers.makeSpreadsheetId().length).toBe(5)
    expect(Helpers.makeSpreadsheetId().length).toBe(5)
  })
})
