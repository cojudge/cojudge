Given a string `s`, decide whether some rearrangement of its characters can form a palindrome. A palindrome reads the same forward and backward.

Return `true` when such a rearrangement exists and `false` otherwise.

**Example 1:**
```
Input: s = "code"
Output: false
Explanation: All four letters differ, so any ordering leaves more than one character with an odd count.
```

**Example 2:**
```
Input: s = "aab"
Output: true
Explanation: Rearranged as "aba", it reads the same in both directions.
```

**Example 3:**
```
Input: s = "carerac"
Output: true
Explanation: Rearranged as "racecar", it is a palindrome.
```

**Constraints:**
- `1 <= s.length <= 5000`
- `s` consists of lowercase and uppercase English letters.
