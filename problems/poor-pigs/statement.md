There are `buckets` buckets of liquid, and exactly one of them is poisoned. A pig that drinks the poison dies `minutesToDie` minutes later; otherwise it survives. You have `minutesToTest` minutes in total, and within that window a pig can drink in several rounds: after each round you wait long enough to see which pigs die before the next round.

With `r` full rounds available, one pig can distinguish `r + 1` different outcomes (dying in round 1, 2, ..., `r`, or surviving everything). With `p` pigs the number of distinguishable outcomes multiplies to `(r + 1)^p`.

Return the smallest number of pigs needed to guarantee finding the poisoned bucket in time.

**Example 1:**
```
Input: buckets = 1000, minutesToDie = 15, minutesToTest = 60
Output: 5
Explanation: There are 4 rounds, so each pig has 5 outcomes and 5 pigs cover 5^5 = 3125 buckets, while 4 pigs cover only 625.
```

**Example 2:**
```
Input: buckets = 4, minutesToDie = 15, minutesToTest = 15
Output: 2
Explanation: With one round each pig has 2 outcomes, and 2 pigs cover 2 * 2 = 4 buckets.
```

**Example 3:**
```
Input: buckets = 4, minutesToDie = 15, minutesToTest = 30
Output: 2
Explanation: Two rounds give each pig 3 outcomes, so 2 pigs cover 3 * 3 = 9 buckets, but 1 pig covers only 3.
```

**Constraints:**
- `1 <= buckets <= 1000`
- `1 <= minutesToDie, minutesToTest <= 100`
