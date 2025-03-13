declare module 'react-syntax-highlighter' {
  import { ComponentType, ReactNode } from 'react';

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: { [key: string]: any };
    children: string | string[];
    customStyle?: { [key: string]: any };
    [key: string]: any;
  }

  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export const Prism: typeof SyntaxHighlighter;
  export const Light: typeof SyntaxHighlighter;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const styles: { [key: string]: { [key: string]: any } };
  export const vscDarkPlus: typeof styles;
} 