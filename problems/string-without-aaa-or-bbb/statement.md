Given counts `a` and `b`, build a string containing exactly `a` copies of `a` and `b` copies of `b` such that neither `aaa` nor `bbb` appears as a contiguous block.

All test inputs satisfy the feasibility condition `max(a, b) <= 2 * (min(a, b) + 1)`, so at least one valid arrangement exists. Any valid arrangement is accepted.

**Example 1:**
```
Input: a = 1, b = 2
Output: "abb"
Explanation: The string uses the required letters and contains no triple.
```

**Example 2:**
```
Input: a = 4, b = 1
Output: "aabaa"
Explanation: Four a's and one b are placed with no three equal neighbors.
```

**Constraints:**
- `0 <= a, b <= 100`
- `a + b > 0`
- Inputs guarantee a valid string exists.
