You are given three arrays. `difficulty[i]` is how hard job `i` is, `profit[i]` is what job `i` pays, and `worker[j]` is the skill level of worker `j`. A worker can only take a job whose difficulty does not exceed their skill, and each worker takes at most the single best-paying job available to them (workers may also take nothing if every job is too hard). Every worker chooses independently, so the same job can be taken by many workers.

Return the greatest total pay all workers can earn together.

**Constraints:**
- `1 <= difficulty.length == profit.length <= 10^4`
- `1 <= difficulty[i], profit[i] <= 10^5`
- `1 <= worker.length <= 10^4`
- `1 <= worker[i] <= 10^5`
