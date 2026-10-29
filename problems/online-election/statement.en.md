Votes arrive over time: `persons[i]` receives one vote at moment `times[i]`, and `times` is strictly increasing. At any moment the leader is the person holding the most votes so far, with ties broken in favor of whoever was voted for most recently.

Instead of building the usual query class, implement `runElection(persons, times, queries)`: it receives the whole vote record plus a batch of query moments and returns, for each query `t`, the leader among votes cast at or before `t`. Every query time is guaranteed to be at least `times[0]`.

**Constraints:**
- `1 <= persons.length == times.length <= 5000`
- `times` is strictly increasing, `0 <= times[i] <= 10^9`
- `0 <= persons[i] < persons.length`
- `1 <= queries.length <= 10000`
- `times[0] <= queries[j] <= 10^9`
