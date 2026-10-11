You are given a row of boxes, each coloured with a positive integer. In one move you may pick any maximal run of consecutive boxes sharing one colour: if the run has length `k` you score `k*k` points and the run disappears, letting the left and right remainders join together.

Repeat until no box remains. Plan the removal order to earn the largest total score and return that maximum.

**Example 1:**
```
Input: boxes = [1,3,2,2,2,3,4,3,1]
Output: 23
Explanation: One optimal order first clears the three 2s (9 points), compacts the 3s, and continues to reach 23 overall.
```

**Example 2:**
```
Input: boxes = [1,1,1]
Output: 9
Explanation: Clearing all three together gives 3*3.
```

**Example 3:**
```
Input: boxes = [1]
Output: 1
```

**Constraints:**
- `1 <= boxes.length <= 100`
- `1 <= boxes[i] <= 100`
