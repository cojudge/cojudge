You are given three arrays. `difficulty[i]` is how hard job `i` is, `profit[i]` is what job `i` pays, and `worker[j]` is the skill level of worker `j`. A worker can only take a job whose difficulty does not exceed their skill, and each worker takes at most the single best-paying job available to them (workers may also take nothing if every job is too hard). Every worker chooses independently, so the same job can be taken by many workers.

Return the greatest total pay all workers can earn together.

**Example 1:**
```
Input: difficulty = [2,4,6,8,10], profit = [10,20,30,40,50], worker = [4,5,6,7]
Output: 100
Explanation: The worker with skill 4 takes the job paying 20, the one with skill 5 also takes 20, and the ones with skill 6 and 7 take 30 each, for 20 + 20 + 30 + 30 = 100.
```

**Example 2:**
```
Input: difficulty = [85,47,57], profit = [24,66,99], worker = [40,25,25]
Output: 0
Explanation: Nobody is skilled enough for any job, so the total is 0.
```

**Constraints:**
- `1 <= difficulty.length == profit.length <= 10^4`
- `1 <= difficulty[i], profit[i] <= 10^5`
- `1 <= worker.length <= 10^4`
- `1 <= worker[i] <= 10^5`
