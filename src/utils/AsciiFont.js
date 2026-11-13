/**
 * @file AsciiFont.js
 * @description Multi-line FIGlet/Banner ASCII font generator for countdown numerals and headings.
 */

export class AsciiFont {
  static FONT_5X5 = {
    '0': [' ### ', '#   #', '# # #', '#   #', ' ### '],
    '1': ['  #  ', ' ##  ', '  #  ', '  #  ', ' ### '],
    '2': [' ### ', '    #', ' ### ', '#    ', '#####'],
    '3': [' ### ', '    #', ' ### ', '    #', ' ### '],
    '4': ['#   #', '#   #', '#####', '    #', '    #'],
    '5': ['#####', '#    ', '#### ', '    #', '#### '],
    '6': [' ### ', '#    ', '#### ', '#   #', ' ### '],
    '7': ['#####', '    #', '   # ', '  #  ', '  #  '],
    '8': [' ### ', '#   #', ' ### ', '#   #', ' ### '],
    '9': [' ### ', '#   #', ' ####', '    #', ' ### '],
    ':': ['     ', '  #  ', '     ', '  #  ', '     '],
    '-': ['     ', '     ', ' ### ', '     ', '     '],
    ' ': ['  ', '  ', '  ', '  ', '  '],
    'A': [' ### ', '#   #', '#####', '#   #', '#   #'],
    'B': ['#### ', '#   #', '#### ', '#   #', '#### '],
    'C': [' ####', '#    ', '#    ', '#    ', ' ####'],
    'D': ['#### ', '#   #', '#   #', '#   #', '#### '],
    'E': ['#####', '#    ', '#### ', '#    ', '#####'],
    'F': ['#####', '#    ', '#### ', '#    ', '#    '],
    'G': [' ####', '#    ', '# ###', '#   #', ' ####'],
    'H': ['#   #', '#   #', '#####', '#   #', '#   #'],
    'I': ['#####', '  #  ', '  #  ', '  #  ', '#####'],
    'J': ['    #', '    #', '    #', '#   #', ' ### '],
    'K': ['#   #', '#  # ', '###  ', '#  # ', '#   #'],
    'L': ['#    ', '#    ', '#    ', '#    ', '#####'],
    'M': ['#   #', '## ##', '# # #', '#   #', '#   #'],
    'N': ['#   #', '##  #', '# # #', '#  ##', '#   #'],
    'O': [' ### ', '#   #', '#   #', '#   #', ' ### '],
    'P': ['#### ', '#   #', '#### ', '#    ', '#    '],
    'Q': [' ### ', '#   #', '# # #', ' ### ', '    #'],
    'R': ['#### ', '#   #', '#### ', '#  # ', '#   #'],
    'S': [' ####', '#    ', ' ### ', '    #', '#### '],
    'T': ['#####', '  #  ', '  #  ', '  #  ', '  #  '],
    'U': ['#   #', '#   #', '#   #', '#   #', ' ### '],
    'V': ['#   #', '#   #', '#   #', ' # # ', '  #  '],
    'W': ['#   #', '#   #', '# # #', '## ##', '#   #'],
    'X': ['#   #', ' # # ', '  #  ', ' # # ', '#   #'],
    'Y': ['#   #', ' # # ', '  #  ', '  #  ', '  #  '],
    'Z': ['#####', '   # ', '  #  ', ' #   ', '#####'],
    '!': ['  #  ', '  #  ', '  #  ', '     ', '  #  '],
    '?': [' ### ', '    #', '  ## ', '     ', '  #  '],
    '.': ['     ', '     ', '     ', '     ', '  #  '],
    '+': ['     ', '  #  ', ' ### ', '  #  ', '     '],
    '*': ['     ', ' # # ', '  #  ', ' # # ', '     '],
  };

  /**
   * Compact 3x3 font for smaller countdown digits.
   */
  static FONT_3X3 = {
    '0': [' _ ', '| |', '|_|'],
    '1': ['   ', '  |', '  |'],
    '2': [' _ ', ' _|', '|_ '],
    '3': [' _ ', ' _|', ' _|'],
    '4': ['   ', '|_|', '  |'],
    '5': [' _ ', '|_ ', ' _|'],
    '6': [' _ ', '|_ ', '|_|'],
    '7': [' _ ', '  |', '  |'],
    '8': [' _ ', '|_|', '|_|'],
    '9': [' _ ', '|_|', ' _|'],
    ':': ['   ', ' : ', '   '],
    '-': ['   ', ' - ', '   '],
    ' ': ['   ', '   ', '   '],
  };

  /**
   * Renders a string of text into an array of ASCII art lines (5 lines tall).
   * @param {string} text
   * @param {number} [spacing=1] - Space in columns between glyphs.
   * @returns {string[]} 5 lines of ASCII text.
   */
  static render(text, spacing = 1) {
    const lines = ['', '', '', '', ''];
    const upper = text.toUpperCase();
    const spaceStr = ' '.repeat(spacing);

    for (let i = 0; i < upper.length; i++) {
      const ch = upper[i];
      const glyph = this.FONT_5X5[ch] || this.FONT_5X5[' '];

      for (let r = 0; r < 5; r++) {
        lines[r] += glyph[r] + (i < upper.length - 1 ? spaceStr : '');
      }
    }

    return lines;
  }

  /**
   * Renders compact 3-line tall numerals.
   * @param {string} text
   * @param {number} [spacing=1]
   * @returns {string[]} 3 lines of ASCII text.
   */
  static renderCompact(text, spacing = 1) {
    const lines = ['', '', ''];
    const spaceStr = ' '.repeat(spacing);

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const glyph = this.FONT_3X3[ch] || this.FONT_3X3[' '];

      for (let r = 0; r < 3; r++) {
        lines[r] += glyph[r] + (i < text.length - 1 ? spaceStr : '');
      }
    }

    return lines;
  }

  /**
   * Calculates width in characters for the rendered text.
   * @param {string} text
   * @param {number} [spacing=1]
   * @returns {number}
   */
  static getWidth(text, spacing = 1) {
    const rendered = this.render(text, spacing);
    return rendered[0] ? rendered[0].length : 0;
  }
}
