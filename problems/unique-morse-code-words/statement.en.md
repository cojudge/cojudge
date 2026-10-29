International Morse code maps each lowercase letter to a sequence of dots and dashes. The table begins `a -> .-`, `b -> -...`, `c -> -.-.`, and continues through `z -> --..` in the usual order.

The encoding of a whole word is formed by replacing every letter with its code and joining the pieces without separators. Given a list of words, determine how many distinct encodings appear.

**Constraints:**
- `1 <= words.length <= 100`
- `1 <= words[i].length <= 12`
- Each word contains only lowercase English letters
