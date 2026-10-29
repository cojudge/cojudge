You are given an array `nums`. A `132 pattern` is a triple of positions `i < j < k` whose values sit in small-large-middle order:

```
nums[i] < nums[k] < nums[j]
```

Return `true` if such a triple exists, and `false` otherwise.

**Constraints:**
- `1 <= nums.length <= 2 * 10^5`
- `-10^9 <= nums[i] <= 10^9`
