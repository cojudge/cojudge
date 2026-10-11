You receive an array `temperatures` holding the temperature of each successive day. Build an array `answer` of matching length, where `answer[i]` records how many days must pass after day `i` before a day with a strictly higher temperature arrives. When no later day is warmer, store `0` at that position.

**Example 1:**
```
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
```

**Example 2:**
```
Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]
```

**Example 3:**
```
Input: temperatures = [30,60,90]
Output: [1,1,0]
```

**Constraints:**
- `1 <= temperatures.length <= 100000`
- `30 <= temperatures[i] <= 100`
