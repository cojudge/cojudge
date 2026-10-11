You receive a collection of strings that use only the characters `0` and `1`, plus two budgets: at most `m` zeroes and at most `n` ones. Choose as many strings as possible so that the total count of `0` characters across the chosen strings stays within `m` and the total count of `1` characters stays within `n`.

Return that largest achievable count of strings.

**Example 1:**

```
Input: strs = ["10","0001","111001","1","0"], m = 5, n = 3
Output: 4
Explanation: Picking "10", "0001", "1" and "0" uses 5 zeroes and 3 ones,
which fits both budgets, and no 5-string choice fits.
```

**Example 2:**

```
Input: strs = ["10","0","1"], m = 1, n = 1
Output: 2
Explanation: "0" plus "1" uses one zero and one one.
```

**Example 3:**

```
Input: strs = ["0","0","1","1"], m = 2, n = 1
Output: 3
Explanation: Two zeroes plus one one is the best feasible mix.
```

**Constraints:**

- `1 <= strs.length <= 600`
- `1 <= strs[i].length <= 100`
- Each `strs[i]` holds only `0` and `1`.
- `1 <= m, n <= 100`
