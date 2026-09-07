You have a lock with 4 circular wheels. Each wheel has 10 slots: `'0','1','2','3','4','5','6','7','8','9'`. The wheels can rotate freely and wrap around.

The lock initially starts at `'0000'`, a string representing the state of the 4 wheels.

You are given a list of `deadends` dead ends, meaning if the lock displays any of these codes, the wheels of the lock will stop turning and you will be unable to open it.

Given a `target` representing the combination which will unlock the lock, return the minimum total number of turns required to open the lock, or `-1` if it is impossible.

**Example 1:**
```
Input: deadends = ["0201","0101","0102","1212","2002"], target = "0202"
Output: 6
```

**Example 2:**
```
Input: deadends = ["8888"], target = "0009"
Output: 1
```

**Example 3:**
```
Input: deadends = ["8887","8889","8878","8898","8788","8988","7888","9888"], target = "8888"
Output: -1
```

**Constraints:**
- `1 <= deadends.length <= 500`
- `deadends[i].length == 4`
- `target.length == 4`
- `target` will not be in the list `deadends`
- `target` and `deadends[i]` consist of digits only
