An array `people` records body masses, with `people[i]` belonging to traveller `i`.
An unbounded fleet of dinghies is available; no dinghy tolerates a combined load above `limit`.
No dinghy accepts more than a pair of travellers simultaneously, and any pair aboard must jointly weigh no more than `limit`.

Determine the smallest fleet size capable of ferrying the whole group.

**Constraints:**

- 1 ≤ people.length ≤ 5 * 10^4
- 1 ≤ people[i] ≤ limit ≤ 3 * 10^4
