A flowerbed row uses `1` for a planted plot and `0` for empty. New flowers cannot touch: no two planted plots may sit side by side. Given `flowerbed` and `n`, decide whether `n` new flowers can be added without breaking the rule.

**Example 1:**
```
Input: flowerbed = [1,0,0,0,1], n = 1
Output: true
```

**Example 2:**
```
Input: flowerbed = [1,0,0,0,1], n = 2
Output: false
```

**Example 3:**
```
Input: flowerbed = [0,0,0], n = 2
Output: true
```

**Constraints:**
- `1 <= flowerbed.length <= 20000`, entries are 0 or 1.
- `0 <= n <= flowerbed.length`; no adjacent ones in the input.
