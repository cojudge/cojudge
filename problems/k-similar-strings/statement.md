Count the fewest swaps turning one anagram into another.

Strings `s1` and `s2` hold the same multiset of lowercase letters. In one move you may swap any two positions of `s1`. Return the smallest number of such swaps that rewrites `s1` into `s2`.

**Example 1:**
```
Input: s1 = "ab", s2 = "ba"
Output: 1
Explanation: A single swap of the two positions fixes the string.
```

**Example 2:**
```
Input: s1 = "abc", s2 = "bca"
Output: 2
Explanation: Swap to "bac" then to "bca", two moves in total.
```

**Example 3:**
```
Input: s1 = "abac", s2 = "baca"
Output: 2
Explanation: Two well-chosen swaps align every position.
```

**Constraints:**
- `1 <= s1.length <= 20`
- `s1.length == s2.length`
- `s1` and `s2` are anagrams with lowercase letters.
