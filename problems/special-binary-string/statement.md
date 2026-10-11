A binary string is called *balanced* when it holds equally many `1`s and `0`s and every prefix contains at least as many `1`s as `0`s.

You are given a balanced string `s`. One move picks two neighboring non-empty balanced blocks that sit directly next to each other inside `s` and exchanges their order. After any number of such moves, return the lexicographically greatest string you can obtain (`1` sorts after `0`).

**Example 1:**
```
Input: s = "11011000"
Output: "11100100"
Explanation: The balanced blocks "10" and "1100" sit side by side; swapping them and recursing inside each block yields the largest arrangement.
```

**Example 2:**
```
Input: s = "10"
Output: "10"
Explanation: A single primitive block cannot be rearranged.
```

**Example 3:**
```
Input: s = "1010"
Output: "1010"
Explanation: Both primitives are "10", so every swap leaves the string unchanged.
```

**Constraints:**
- `1 <= s.length <= 50`
- `s[i]` is `'0'` or `'1'`
- `s` is balanced
