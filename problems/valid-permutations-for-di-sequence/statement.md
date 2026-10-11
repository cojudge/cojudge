You receive a pattern string `s` of length `n` where each character is either `D` (the next number must drop) or `I` (the next number must climb). Consider shuffles of the numbers `0` through `n` inclusive: a shuffle is acceptable when every neighbouring pair obeys the corresponding letter.

Count the acceptable shuffles, giving the total modulo `10^9 + 7`.

**Example 1:**
```
Input: s = "DID"
Output: 5
Explanation: Among the 24 orders of 0..3, five follow down-up-down, such as 1-3-0-2 in spirit.
```

**Example 2:**
```
Input: s = "D"
Output: 1
Explanation: Only the order [1,0] descends; [0,1] does not.
```

**Example 3:**
```
Input: s = "I"
Output: 1
Explanation: Only [0,1] climbs.
```

**Constraints:**
- `n == s.length`
- `1 <= n <= 200`
- `s[i]` is `'I'` or `'D'`.
