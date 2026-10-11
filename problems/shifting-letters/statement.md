Shift the letters of a string by suffix totals.

You receive a lowercase string `s` and an array `shifts` of the same length. Conceptually, `shifts[i]` says how many forward steps (wrapping from z back to a) apply to the prefix ending at `i`; equivalently each position `i` moves by the sum of `shifts[j]` for all `j >= i`. Apply all shifts with modulo 26 and return the resulting string.

**Example 1:**
```
Input: s = "abc", shifts = [3,5,9]
Output: "rpl"
Explanation: Totals from the right are 17, 14, 9, turning a,b,c into r,p,l.
```

**Example 2:**
```
Input: s = "aaa", shifts = [1,2,3]
Output: "gfd"
Explanation: Suffix sums 6, 5, 3 shift the three letters accordingly.
```

**Example 3:**
```
Input: s = "z", shifts = [52]
Output: "z"
Explanation: A full double rotation returns to the start.
```

**Constraints:**
- `1 <= s.length <= 10^5`
- `s` holds lowercase English letters.
- `shifts.length == s.length`
- `0 <= shifts[i] <= 10^9`
