A *generalized abbreviation* of a word is formed by replacing any set of non-overlapping substrings with their lengths, leaving the remaining letters in place. For instance, from `word` one can produce `4`, `3d`, `2r1`, `1o2`, or keep `word` itself (replacing nothing).

Given a word, return every distinct generalized abbreviation of it, in any order.

**Example 1:**
```
Input: word = "word"
Output: ["4","3d","2r1","2rd","1o2","1o1d","1or1","1ord","w3","w2d","w1r1","w1rd","wo2","wo1d","wor1","word"]
Explanation: Each position is either abbreviated or kept, giving 2^4 = 16 variants; adjacent abbreviated runs merge into one number.
```

**Example 2:**
```
Input: word = "a"
Output: ["1","a"]
Explanation: The single letter is either replaced by its count or kept.
```

**Example 3:**
```
Input: word = "ab"
Output: ["2","1b","a1","ab"]
Explanation: Both letters abbreviated gives "2"; abbreviating one side gives "1b" and "a1"; keeping both gives "ab".
```

**Constraints:**
- `1 <= word.length <= 15`
- `word` consists of lowercase English letters.
