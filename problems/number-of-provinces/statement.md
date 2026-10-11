There are `n` cities labelled `0` through `n-1`. A square table `isConnected` records direct links: entry `[i][j]` is `1` when city `i` connects straight to city `j`, else `0`. Links are mutual, and every city links to itself.

Cities belong to the same province when they connect directly or through a chain of intermediate cities. Count how many separate provinces exist.

**Example 1:**
```
Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]
Output: 2
Explanation: Cities 0 and 1 link together; city 2 stands alone.
```

**Example 2:**
```
Input: isConnected = [[1,0,0],[0,1,0],[0,0,1]]
Output: 3
Explanation: No city links to another, so each is its own province.
```

**Example 3:**
```
Input: isConnected = [[1,1,1],[1,1,1],[1,1,1]]
Output: 1
Explanation: All cities interconnect.
```

**Constraints:**
- `1 <= n <= 200`
- `n == isConnected.length == isConnected[i].length`
- `isConnected[i][j]` is `0` or `1`
- `isConnected[i][i] == 1` and the matrix is symmetric
