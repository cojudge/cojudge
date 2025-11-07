import fs from 'fs/promises';
import path from 'path';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const problemsDir = path.resolve('problems');
    const entries = await fs.readdir(problemsDir, { withFileTypes: true } as any);

    const problems = await Promise.all(
        entries
            .filter((e: any) => e.isDirectory())
            .map(async (dirent: any) => {
                try {
                    const metaPath = path.join(problemsDir, dirent.name, 'metadata.json');
                    const content = await fs.readFile(metaPath, 'utf-8');
                    const data = JSON.parse(content);
                    return {
                        id: data.id,
                        title: data.title,
                        difficulty: data.difficulty,
                        link: data.link,
                        category: data.category
                    };
                } catch (_) {
                    return null;
                }
            })
    );

    // Load course info (title and category order)
    let courseInfo: any = null;
    try {
        const coursePath = path.resolve('courses', 'blind75', 'courseinfo.json');
        const json = await fs.readFile(coursePath, 'utf-8');
        courseInfo = JSON.parse(json);
    } catch (_) {
        courseInfo = null;
    }

    const allProblems = problems.filter((p): p is NonNullable<typeof p> => Boolean(p));

    let finalProblems = allProblems;
    const mapping: Record<string, string[]> | undefined = (courseInfo?.["problems-of-category"]) as any;
    if (mapping && typeof mapping === 'object') {
        const byId = new Map<string, typeof allProblems[number]>();
        for (const p of allProblems) byId.set(p.id, p);

        const ordered: typeof allProblems = [];
        const seen = new Set<string>();

        const categories: string[] = Array.isArray(courseInfo?.["category-order"]) && (courseInfo as any)["category-order"].length
            ? (courseInfo as any)["category-order"]
            : Object.keys(mapping);

        for (const cat of categories) {
            const ids = mapping[cat] || [];
            for (const id of ids) {
                if (seen.has(id)) continue;
                const meta = byId.get(id);
                if (meta) {
                    ordered.push(meta);
                    seen.add(id);
                }
            }
        }

        finalProblems = ordered;
    }

    return {
        problems: finalProblems,
        courseInfo
    };
};