## Approach

Count the 26 task frequencies and let `maximum` be the largest frequency and `maximum_count` the number of task types with that frequency. Those tasks define a minimum block schedule of `(maximum - 1) * (n + 1) + maximum_count`; the answer is the larger of that value and the number of tasks.

## Complexity Analysis

- **Time Complexity:** O(t), where `t` is `tasks.length`.
- **Space Complexity:** O(1), because the frequency array always has 26 entries.

## Implementation

```python
class Solution:
    def leastInterval(self, tasks: str, n: int) -> int:
        frequencies = [0] * 26
        for task in tasks:
            frequencies[ord(task) - ord("A")] += 1
        maximum = max(frequencies)
        maximum_count = sum(frequency == maximum for frequency in frequencies)
        return max(len(tasks), (maximum - 1) * (n + 1) + maximum_count)
```
