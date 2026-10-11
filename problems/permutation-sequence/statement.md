Consider the digits `1` through `n` arranged in increasing order. All `n!` orderings of these digits can be listed from smallest to largest in dictionary order. Given `n` and a 1-based position `k`, return the ordering that appears at that position.

For example, with `n = 3` the ordered list is `123`, `132`, `213`, `231`, `312`, `321`, so asking for `k = 3` yields `213`.

Do not generate every ordering; instead decide the result one place at a time by counting how many orderings start with each remaining digit.

**Example 1:**
```
Input: n = 3, k = 3
Output: "213"
Explanation: The orderings are 123, 132, 213, 231, 312, 321; the 3rd is 213.
```

**Example 2:**
```
Input: n = 4, k = 9
Output: "2314"
Explanation: Among the 24 orderings of 1..4, the 9th in sorted order is 2314.
```

**Example 3:**
```
Input: n = 3, k = 1
Output: "123"
Explanation: The first ordering is the digits in increasing order.
```

**Constraints:**
- `1 <= n <= 9`
- `1 <= k <= n!`
