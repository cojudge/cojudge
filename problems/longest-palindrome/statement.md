You are given a string `s` made of upper- and lowercase English letters. By reordering its characters (using each at most as often as it appears), build the longest possible palindrome — a string reading identically forwards and backwards.

Upper- and lowercase versions of a letter are different characters. Return the length of the best palindrome, not the palindrome itself.

**Example 1:**
```
Input: s = "abccccdd"
Output: 7
Explanation: One optimal arrangement is dccaccd, with pairs cc, cc, dd plus a center a.
```

**Example 2:**
```
Input: s = "a"
Output: 1
```

**Example 3:**
```
Input: s = "Aa"
Output: 1
Explanation: A and a cannot pair, so only one of them fits.
```

**Constraints:**
- `1 <= s.length <= 2000`
- `s` contains only English letters `A-Z` and `a-z`.
