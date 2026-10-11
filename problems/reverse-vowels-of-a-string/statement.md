Take the string `s` and flip the order of its vowels while leaving every other character exactly where it is.

Vowels are the letters `a`, `e`, `i`, `o`, `u` in either upper or lower case. Collect them in the order they appear, then write them back in reverse across the same vowel positions. Consonants, digits, spaces, and punctuation never move.

Return the resulting string.

**Example 1:**
```
Input: s = "IceCreAm"
Output: "AceCreIm"
Explanation: Vowels appear as I, e, e, A; writing them back reversed gives A, e, e, I.
```

**Example 2:**
```
Input: s = "leetcode"
Output: "leotcede"
Explanation: Vowels e, e, o, e become e, o, e, e across the same slots.
```

**Constraints:**
- `1 <= s.length <= 3 * 10^5`
- `s` consists of printable ASCII characters.
