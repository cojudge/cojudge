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

    return {
        problems: problems.filter((p): p is NonNullable<typeof p> => Boolean(p)),
        courseInfo
    };
};