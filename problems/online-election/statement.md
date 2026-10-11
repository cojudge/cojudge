Votes arrive over time: `persons[i]` receives one vote at moment `times[i]`, and `times` is strictly increasing. At any moment the leader is the person holding the most votes so far, with ties broken in favor of whoever was voted for most recently.

Instead of building the usual query class, implement `runElection(persons, times, queries)`: it receives the whole vote record plus a batch of query moments and returns, for each query `t`, the leader among votes cast at or before `t`. Every query time is guaranteed to be at least `times[0]`.

**Example 1:**
```
Input: persons = [0,1,1,0,0,1,0], times = [0,5,10,15,20,25,30], queries = [3,12,25,15,24,8]
Output: [0,1,1,0,0,1]
```

**Example 2:**
```
Input: persons = [0,0,0,1,1], times = [0,10,20,30,40], queries = [0,10,25,40]
Output: [0,0,0,0]
```

**Example 3:**
```
Input: persons = [1,2,2,1,2], times = [5,10,15,20,25], queries = [5,14,20,100]
Output: [1,2,1,2]
```

**Constraints:**
- `1 <= persons.length == times.length <= 5000`
- `times` is strictly increasing, `0 <= times[i] <= 10^9`
- `0 <= persons[i] < persons.length`
- `1 <= queries.length <= 10000`
- `times[0] <= queries[j] <= 10^9`
