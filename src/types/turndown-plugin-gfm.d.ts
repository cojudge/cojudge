declare module 'turndown-plugin-gfm' {
  import type TurndownService from 'turndown';
  export type TurndownPlugin = (service: TurndownService) => void;
  export const gfm: TurndownPlugin;
  export const tables: TurndownPlugin;
  export const strikethrough: TurndownPlugin;
  export const taskListItems: TurndownPlugin;
  export const highlightedCodeBlock: TurndownPlugin;
}
