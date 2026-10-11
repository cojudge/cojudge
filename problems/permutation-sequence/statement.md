Consider the digits `1` through `n` arranged in increasing order. All `n!` orderings of these digits can be listed from smallest to largest in dictionary order. Given `n` and a 1-based position `k`, return the ordering that appears at that position.

For example, with `n = 3` the ordered list is `123`, `132`, `213`, `231`, `312`, `321`, so asking for `k = 3` yields `213`.

Do not generate every ordering; instead decide the result one place at a time by counting how many orderings start with each remaining digit.

**Constraints:**
- `1 <= n <= 9`
- `1 <= k <= n!`
