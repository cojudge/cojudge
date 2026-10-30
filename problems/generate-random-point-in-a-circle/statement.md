Given the radius and the position of the center of a circle, implement the function `randPoint` which generates a uniform random point inside the circle.

Implement the `RandPoint` class:

- `RandPoint(double radius, double xCenter, double yCenter)` Initializes the object with the radius of the circle `radius` and the position of the center `(xCenter, yCenter)`.
- `double[] randPoint()` Returns a random point inside the circle. A point on the circumference of the circle is considered to be in the circle. The answer is returned as an array `[x, y]`.

The class is named `RandPoint` here instead of LeetCode's `Solution` because the judge harness reserves `Solution` for its driver; the constructor and methods match the original. (C# only: the point method is named `NextPoint`, since C# forbids a method sharing its class's name.)

Grading: each `randPoint` output must parse as `[x,y]` doubles satisfying `(x - xCenter)^2 + (y - yCenter)^2 <= radius^2 * (1 + 1e-9) + 1e-9`. Any valid trace is accepted — uniformity over the disk is not statistically tested. In this judge the constructor arguments arrive as integers (integral radius and center, all valid LeetCode inputs); outputs use the compact `"[x,y]"` text form.

**Constraints:**
- `0 < radius <= 10^8`
- `-10^7 <= xCenter, yCenter <= 10^7`
- At most `3 * 10^4` calls will be made to `randPoint`.
