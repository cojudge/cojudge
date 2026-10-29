There are `n` cities labelled `0` through `n-1`. A square table `isConnected` records direct links: entry `[i][j]` is `1` when city `i` connects straight to city `j`, else `0`. Links are mutual, and every city links to itself.

Cities belong to the same province when they connect directly or through a chain of intermediate cities. Count how many separate provinces exist.

**Constraints:**
- `1 <= n <= 200`
- `n == isConnected.length == isConnected[i].length`
- `isConnected[i][j]` is `0` or `1`
- `isConnected[i][i] == 1` and the matrix is symmetric
