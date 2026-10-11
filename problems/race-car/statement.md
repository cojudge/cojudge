A car starts at position 0 with speed 1. Two commands are available: `A` (accelerate) moves the car forward by its current speed and then doubles the speed, while `R` (reverse) turns the car around and resets the speed to 1 in the new direction (positions stay put on `R`).

Given a flag at integer `target > 0`, find the smallest number of commands that lands the car exactly on the flag. The car may pass the flag and come back.

Adaptation note: this task uses plain integers for input and output.

**Constraints:**
- `1 <= target <= 10000`
