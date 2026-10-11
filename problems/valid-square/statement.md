Four points in order-free form are given as `p1` through `p4`, each `[x,y]`. Decide whether they are exactly the four corners of a square, in any order. Sides must be positive and equal, diagonals equal and longer by a factor of two in squared length.

**Example 1:**
```
Input: p1 = [0,0], p2 = [1,1], p3 = [1,0], p4 = [0,1]
Output: true
```

**Example 2:**
```
Input: p1 = [0,0], p2 = [1,1], p3 = [1,0], p4 = [0,12]
Output: false
```

**Example 3:**
```
Input: p1 = [1,0], p2 = [-1,0], p3 = [0,1], p4 = [0,-1]
Output: true
```

**Constraints:**
- Coordinates fit in 32-bit integers.
- Points may repeat or be collinear.
