International Morse code maps each lowercase letter to a sequence of dots and dashes. The table begins `a -> .-`, `b -> -...`, `c -> -.-.`, and continues through `z -> --..` in the usual order.

The encoding of a whole word is formed by replacing every letter with its code and joining the pieces without separators. Given a list of words, determine how many distinct encodings appear.

**Example 1:**
```
Input: words = ["gin","zen","gig","msg"]
Output: 2
Explanation: gin and zen share one encoding, while gig and msg share another.
```

**Example 2:**
```
Input: words = ["a"]
Output: 1
Explanation: A single word yields a single encoding.
```

**Example 3:**
```
Input: words = ["abc","def","ghi"]
Output: 3
Explanation: Each word maps to a different dot-dash string.
```

**Constraints:**
- `1 <= words.length <= 100`
- `1 <= words[i].length <= 12`
- Each word contains only lowercase English letters
