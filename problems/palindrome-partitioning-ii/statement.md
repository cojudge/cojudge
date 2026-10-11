Given a string `s`, split it into pieces so that every piece reads the same forwards and backwards.

Count cuts between pieces: a string that is already a palindrome needs `0` cuts, a split into two palindromes needs `1` cut, and so on.

Return the smallest number of cuts that achieves such a split.

**Example 1:**
```
Input: s = "aab"
Output: 1
Explanation: Splitting as "aa" | "b" uses one cut and both parts are palindromes.
```

**Example 2:**
```
Input: s = "a"
Output: 0
Explanation: A single character is already a palindrome.
```

**Example 3:**
```
Input: s = "ab"
Output: 1
Explanation: "a" | "b" is the only palindromic split.
```

**Constraints:**
- `1 <= s.length <= 2000`
- `s` contains only lowercase English letters.
