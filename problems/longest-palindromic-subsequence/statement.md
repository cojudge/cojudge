A subsequence keeps a selection of characters in their original relative order while possibly skipping others. A palindrome reads identically forward and backward.

Given a string `s`, determine the length of the longest subsequence of `s` that forms a palindrome. The subsequence itself need not be contiguous.

**Example 1:**
```
Input: s = "bbbab"
Output: 4
Explanation: Skipping one 'a' leaves "bbbb", a palindrome of length 4.
```

**Example 2:**
```
Input: s = "cbbd"
Output: 2
Explanation: "bb" is the longest palindromic subsequence.
```

**Example 3:**
```
Input: s = "a"
Output: 1
Explanation: A single character is always a palindrome.
```

**Constraints:**
- `1 <= s.length <= 1000`
- `s` consists of lowercase English letters
