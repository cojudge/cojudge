import translations from './ru.json';

/** Translate display text only; IDs, stored status values and code stay unchanged. */
export function ru(value: string): string {
    return (translations as Record<string, string>)[value] ?? value;
}
