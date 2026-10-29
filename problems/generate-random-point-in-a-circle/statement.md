Given the radius and the position of the center of a circle, implement the function `randPoint` which generates a uniform random point inside the circle.

Implement the `RandPoint` class:

- `RandPoint(double radius, double xCenter, double yCenter)` Initializes the object with the radius of the circle `radius` and the position of the center `(xCenter, yCenter)`.
- `double[] randPoint()` Returns a random point inside the circle. A point on the circumference of the circle is considered to be in the circle. The answer is returned as an array `[x, y]`.

The class is named `RandPoint` here instead of LeetCode's `Solution` because the judge harness reserves `Solution` for its driver; the constructor and methods match the original. (C# only: the point method is named `NextPoint`, since C# forbids a method sharing its class's name.)

Grading: each `randPoint` output must parse as `[x,y]` doubles satisfying `(x - xCenter)^2 + (y - yCenter)^2 <= radius^2 * (1 + 1e-9) + 1e-9`. Any valid trace is accepted — uniformity over the disk is not statistically tested. In this judge the constructor arguments arrive as integers (integral radius and center, all valid LeetCode inputs); outputs use the compact `"[x,y]"` text form.

**Example 1:**
```
Input: operations = ["RandPoint","randPoint","randPoint","randPoint"], values = [[1,0,0],[],[],[]]
Output: [null,[0.1,0.2],[0,0],[-0.5,0.5]]
Explanation: Any point within distance 1 of the origin is accepted; returning the center itself is valid.
```

**Example 2:**
```
Input: operations = ["RandPoint","randPoint"], values = [[2,3,-1],[]]
Output: [null,[3,-1]]
Explanation: The center (3,-1) is distance 0 from itself, so it is always a valid (though not uniform) answer.
```

**Example 3:**
```
Input: operations = ["RandPoint","randPoint","randPoint"], values = [[5,2,-3],[],[]]
Output: [null,[2,-3],[6.5,-1.0]]
Explanation: Both the center and any point within 5.0 of (2,-3) pass the checker.
```

**Constraints:**
- `0 < radius <= 10^8`
- `-10^7 <= xCenter, yCenter <= 10^7`
- At most `3 * 10^4` calls will be made to `randPoint`.
