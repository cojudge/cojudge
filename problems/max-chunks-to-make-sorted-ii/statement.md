You are given an integer array `arr` that may contain duplicates. Cut it into the greatest possible number of contiguous blocks (chunks) so that sorting each block separately and then gluing the blocks back together produces the fully sorted array.

Return how many blocks that finest valid split contains.

**Example 1:**
```
Input: arr = [5,4,3,2,1]
Output: 1
Explanation: No split point works: sorting [5,4] and [3,2,1] separately gives [4,5,1,2,3], not sorted. Only the whole array works.
```

**Example 2:**
```
Input: arr = [2,1,3,4,4]
Output: 4
Explanation: Cut after indices 1, 2, and 3 to get [2,1], [3], [4], [4]; sorting each piece gives [1,2,3,4,4].
```

**Example 3:**
```
Input: arr = [1,1,0,0,1]
Output: 2
Explanation: The split [1,1,0,0] and [1] works, and no finer split does.
```

**Constraints:**
- `1 <= arr.length <= 2000`
- `0 <= arr[i] <= 10^8`
