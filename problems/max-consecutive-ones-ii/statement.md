You get a binary array. You may flip at most one `0` into a `1` (you can also flip nothing). After that single optional flip, how long can the longest block of consecutive `1`s become?

Return that maximum length.

**Example 1:**

```
Input: nums = [1,0,1,1,0]
Output: 4
Explanation: Turning the first 0 into 1 gives [1,1,1,1,0] with four
in a row; flipping the second 0 gives only three.
```

**Example 2:**

```
Input: nums = [1,0,1,1,0,1]
Output: 4
Explanation: Either flip yields a run of four consecutive 1s.
```

**Example 3:**

```
Input: nums = [1,1,1]
Output: 3
Explanation: No flip is needed; the whole array already qualifies.
```

**Constraints:**

- `1 <= nums.length <= 10^5`
- Each `nums[i]` is `0` or `1`.
