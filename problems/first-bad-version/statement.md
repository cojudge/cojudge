Версии `1..n` становятся плохими, начиная с какого-то скрытого порога: каждая версия с первой плохой и далее плоха.Взаимодействуйте с объектом судьи `vc` — ваш код никогда не получает `bad` напрямую:

- `isBadVersion(version)` отвечает на вопрос, плоха ли эта версия.

Внедряйте `firstBadVersion(n, vc)`, возвращая первую плохую версию, минимизируя количество вызовов API. Бинарный поиск требует вызовов `O(log n)`; судья подсчитывает ваши звонки и сообщает Неправильный ответ, если вы превышаете **100** вызовы по тестовому делу.

Имена методов на языке: Java `vc.isBadVersion(version)`, Python `vc.is_bad_version(version)`, C++ `vc.isBadVersion(version)`, C# `vc.IsBadVersion(version)`, Rust `vc.is_bad_version(version)`, Go `vc.IsBadVersion(version)`, TypeScript `vc.isBadVersion(version)`, PHP `$vc->isBadVersion($version)`.

**Ограничения:**

- `1 <= bad <= n <= 2^31 - 1`
- В большинстве случаев 100 API вызывается в тестовом случае.
