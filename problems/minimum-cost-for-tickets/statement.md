You plan to travel on the calendar days listed in the strictly increasing array `days`. There are three pass kinds with prices in `costs`: `costs[0]` covers one day, `costs[1]` covers any 7 consecutive days, and `costs[2]` covers any 30 consecutive days. A pass can start on any day and covers that day plus the following days in its window.

Buy passes so that every listed travel day is covered with the smallest possible total price. Return that minimum price.

**Example 1:**
```
Input: days = [1,4,6,7,8,20], costs = [2,7,15]
Output: 11
Explanation: One weekly pass plus two daily passes cover all travel days for 11.
```

**Example 2:**
```
Input: days = [1,2,3,4,5,6,7,8,9,10,30,31], costs = [2,7,15]
Output: 17
Explanation: The cheapest mix of weekly and daily passes costs 17.
```

**Constraints:**
- `1 <= days.length <= 365`
- `1 <= days[i] <= 365`, strictly increasing.
- `1 <= costs.length == 3`, `1 <= costs[i] <= 1000`.
