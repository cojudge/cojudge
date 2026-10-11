A permutation of `1..n` is called beautiful when no three indices `i < j < k` form an arithmetic progression in values, meaning `2 * arr[j] != arr[i] + arr[k]` for every triple.

Given `n`, return any beautiful permutation. The checker verifies the permutation property and the progression rule rather than matching one exact order.

**Example 1:**
```
Input: n = 4
Output: [2,1,4,3]
Explanation: No triple is evenly spaced; one valid answer.
```

**Example 2:**
```
Input: n = 5
Output: [1,5,3,2,4]
Explanation: Another valid ordering.
```

**Example 3:**
```
Input: n = 1
Output: [1]
```

**Constraints:**
- `1 <= n <= 1000`

Adaptation: the output uses `int_array`; any valid beautiful array is accepted.
