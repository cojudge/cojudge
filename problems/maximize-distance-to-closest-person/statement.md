Choose an empty seat that stays farthest from anyone seated.

The array `seats` marks chairs with `1` for occupied and `0` for empty; at least one of each exists. You must sit in an empty chair. Your distance to the closest occupied chair should be as large as possible. Return that best achievable distance.

**Example 1:**
```
Input: seats = [1,0,0,0,1,0,1]
Output: 2
Explanation: Sitting at index 2 gives distance 2 to either neighbour block.
```

**Example 2:**
```
Input: seats = [1,0,0,0]
Output: 3
Explanation: The far end at index 3 is three steps from the person at 0.
```

**Example 3:**
```
Input: seats = [0,1]
Output: 1
Explanation: Only index 0 is free, one step away.
```

**Constraints:**
- `2 <= seats.length <= 20000`
- `seats[i]` is `0` or `1`, with at least one of each.
