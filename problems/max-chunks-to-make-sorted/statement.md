You are given an array `arr` of length `n` holding each integer from `0` to `n - 1` exactly once (a permutation).

Split it into the most contiguous chunks possible so that sorting every chunk on its own and concatenating the results equals the fully sorted array `[0, 1, ..., n-1]`. Return that largest number of chunks.

**Example 1:**
```
Input: arr = [4,3,2,1,0]
Output: 1
Explanation: Any earlier cut would trap a large value in an early chunk, so only the whole array works.
```

**Example 2:**
```
Input: arr = [1,0,2,3,4]
Output: 4
Explanation: Cut into [1,0], [2], [3], [4]; sorting each gives [0,1,2,3,4].
```

**Example 3:**
```
Input: arr = [0,1,2]
Output: 3
Explanation: An already sorted permutation allows one chunk per element.
```

**Constraints:**
- `n == arr.length`
- `1 <= n <= 10`
- `0 <= arr[i] < n`
- All values are distinct
