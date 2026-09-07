You are given two integers `n` and `x`. You have to construct an array of positive integers `nums` of size `n` where for every `0 <= i < n - 1`, `nums[i + 1]` is greater than `nums[i]`, and the result of the bitwise AND operation between all elements of `nums` is `x`.

Return the minimum possible value of `nums[n - 1]`.

**Examples:**

```
Input: n = 3, x = 4
Output: 6
Explanation: nums can be [4, 5, 6], since 4 AND 5 AND 6 = 4 and all elements are strictly increasing. 6 is the smallest possible nums[2].
```

```
Input: n = 2, x = 7
Output: 15
Explanation: nums can be [7, 15], since 7 AND 15 = 7 and all elements are strictly increasing. 15 is the smallest possible nums[1].
```

**Constraints:**

- `1 <= n, x <= 10^8`