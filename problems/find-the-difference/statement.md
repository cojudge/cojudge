Two lowercase strings are given. The second string is formed by shuffling the characters of the first one and then inserting exactly one additional lowercase letter at some position. Identify which letter was inserted.

*Interface note:* the original statement returns a single character. In this repo every language models that answer as a one-character `string`, so return e.g. `"e"` rather than `'e'`.

**Example 1:**
```
Input: s = "abcd", t = "abcde"
Output: "e"
Explanation: Reordering "abcd" can produce "abcd", and the surplus letter in
"t" is "e".
```

**Example 2:**
```
Input: s = "", t = "y"
Output: "y"
Explanation: The first string is empty, so the only letter of "t" is the extra one.
```

**Example 3:**
```
Input: s = "aaab", t = "aaaba"
Output: "a"
Explanation: Three of the four 'a' letters pair up; one 'a' is left over.
```

**Constraints:**
- `0 <= s.length <= 1000`
- `t.length == s.length + 1`
- `s` and `t` contain only lowercase English letters.
