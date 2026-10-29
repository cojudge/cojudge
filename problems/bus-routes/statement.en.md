Each bus route is a list of stops it serves in order; you may board or alight at any stop on a route, and changing buses is allowed only at a shared stop. Given all `routes`, a starting stop `source` and a destination `target`, find the smallest number of buses you must ride to reach the destination.

If the start equals the destination, the answer is 0 without boarding. If the destination cannot be reached at all, return -1. Otherwise count each bus boarded, including the first and the last.

**Constraints:**
- `1 <= routes.length <= 500`
- `1 <= routes[i].length <= 10^5`
- Total stops across routes is at most `10^5`.
- `0 <= routes[i][j] < 10^6`
- `0 <= source, target < 10^6`
