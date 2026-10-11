You are given two whole numbers `n` and `k`. Picture all numbers from `1` to `n` written out and then ordered the way words appear in a dictionary (so all numbers starting with `1` come before those starting with `2`, and `10` sits between `1` and `11`).

Return the `k`-th number in that dictionary ordering, counting from `1`.

**Example 1:**
```
Input: n = 13, k = 2
Output: 10
Explanation: Dictionary order starts 1, 10, 11, 12, 13, 2, 3, .... The second entry is 10.
```

**Example 2:**
```
Input: n = 1, k = 1
Output: 1
Explanation: Only one value exists.
```

**Constraints:**
- `1 <= k <= n <= 10^9`
