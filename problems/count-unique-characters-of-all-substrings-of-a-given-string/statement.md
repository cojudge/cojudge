Given a string `s` of uppercase English letters, look at every contiguous substring (including the whole string and each single character). For one substring, its score is the number of characters that occur exactly once inside it. Add up the scores of all substrings and return the total modulo `10^9 + 7`.

**Example 1:**
```
Input: s = "ABC"
Output: 10
Explanation: The substrings are "A", "B", "C" (score 1 each), "AB", "BC" (score 2 each), and "ABC" (score 3), giving 1 + 1 + 1 + 2 + 2 + 3 = 10.
```

**Example 2:**
```
Input: s = "ABA"
Output: 8
Explanation: Scores are 1, 1, 1 for the singles, 2 for "AB", 2 for "BA", and 1 for "ABA" since only "B" is unique there, totalling 8.
```

**Example 3:**
```
Input: s = "LEETCODE"
Output: 92
```

**Constraints:**
- `1 <= s.length <= 10^5`
- `s` consists of uppercase English letters only
