You are given an integer array `arr` and an integer `target`. Count the triplets of positions `(i, j, k)` with `i < j < k` whose values add up to `target`.

Return that count modulo `10^9 + 7`.

**Example 1:**
```
Input: arr = [1,1,2,2,3,3,4,4,5,5], target = 8
Output: 20
```

**Example 2:**
```
Input: arr = [1,1,2,2,2,2], target = 5
Output: 12
```

**Example 3:**
```
Input: arr = [2,1,3], target = 6
Output: 1
```

**Constraints:**
- `3 <= arr.length <= 3000`
- `0 <= arr[i] <= 100`
- `0 <= target <= 300`
