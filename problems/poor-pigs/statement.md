There are `buckets` buckets of liquid, and exactly one of them is poisoned. A pig that drinks the poison dies `minutesToDie` minutes later; otherwise it survives. You have `minutesToTest` minutes in total, and within that window a pig can drink in several rounds: after each round you wait long enough to see which pigs die before the next round.

With `r` full rounds available, one pig can distinguish `r + 1` different outcomes (dying in round 1, 2, ..., `r`, or surviving everything). With `p` pigs the number of distinguishable outcomes multiplies to `(r + 1)^p`.

Return the smallest number of pigs needed to guarantee finding the poisoned bucket in time.

**Constraints:**
- `1 <= buckets <= 1000`
- `1 <= minutesToDie, minutesToTest <= 100`
