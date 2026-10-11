A word uses capitals correctly when one of three patterns holds: every letter is uppercase (e.g. `"USA"`), every letter is lowercase (e.g. `"leetcode"`), or only the first letter is uppercase and the rest are lowercase (e.g. `"Google"`).

Given `word`, return `true` when its capitalization follows one of these patterns and `false` otherwise.

**Example 1:**
```
Input: word = "USA"
Output: true
Explanation: All letters are uppercase.
```

**Example 2:**
```
Input: word = "leetcode"
Output: true
Explanation: All letters are lowercase.
```

**Example 3:**
```
Input: word = "Google"
Output: true
Explanation: Only the leading letter is uppercase.
```

**Example 4:**
```
Input: word = "FlaG"
Output: false
Explanation: Uppercase letters appear in the tail without covering the whole word.
```

**Constraints:**
- `1 <= word.length <= 100`
- `word` consists of English letters
