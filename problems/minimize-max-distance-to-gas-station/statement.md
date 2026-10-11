You are given the sorted positions `stations` of existing gas stops on a line and an integer `k`. You may build at most `k` extra stops at any real-valued positions you choose.

After placement, look at the gaps between consecutive stops (old and new). Your goal is to make the largest such gap as small as possible.

Because distances are fractional, this judge exchanges them as decimal strings: implement `minmaxGasDist(stations, k)` returning a finite decimal string parseable as a double. An answer is accepted when it lies within `1e-5` of the true optimum (absolute or relative).

**Example 1:**
```
Input: stations = [1,2,3,4,5,6,7,8,9,10], k = 9
Output: "0.5"
Explanation: Put one new stop in the middle of every unit gap; all gaps become 0.5.
```

**Example 2:**
```
Input: stations = [23,24,36,39,46,56,57,65,84,98], k = 1
Output: "14.0"
Explanation: The best use of the single stop splits the gap 65-84 (length 19) into 9.5 and 9.5, leaving the gap 84-98 (length 14) as the new maximum.
```

**Example 3:**
```
Input: stations = [1,10], k = 1
Output: "4.5"
Explanation: One stop in the middle halves the length-9 gap.
```

**Constraints:**
- `2 <= stations.length <= 2000`
- `0 <= stations[i] <= 10^8` and `stations` is strictly increasing
- `1 <= k <= 10^5`
- The output must be a finite decimal string parseable as a double
