Повторите мультисет со случайной выборкой через одну функцию пакета.

Это детерминированная, функциональная адаптация классического дизайна с разрешением дубликатов: реализовать `runRandomizedCollection(operations, values)`. Оба массива имеют одну длину. Ввод `0` всегда `"RandomizedCollection"` с фиктивным значением `0`. Каждая более поздняя запись:

- `"insert"` with `values[i] = val`: add one copy of `val` (duplicates allowed). Record `1` when no copy existed before, else `0`.
- `"remove"` with `values[i] = val`: delete one copy when present. Record `1` when a copy was removed, else `0`.
- `"getRandom"` with dummy `values[i] = 0`: record one value currently held (any copy).

Классическая версия также требует выборки, пропорциональной множеству и среднему времени O (1); этот портативный судья проверяет только действительность - каждая запись `getRandom` должна иметь оставшуюся копию, а не распределение. Цель для среднего O (1) со списком плюс наборы индексов.

**Ограничения:**
- `1 <= operations.length == values.length <= 2 * 10^5`
- `operations[0] == "RandomizedCollection"`
- Более поздние операции — `insert`, `remove` или `getRandom`.
- `-2^31 <= val <= 2^31 - 1`
- `getRandom` вызывается только при наличии хотя бы одной копии.
