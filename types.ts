
export enum VisualStyle {
  NEWS = 'News-Style',
  CINEMATIC = 'Cinematic',
  MINIMALIST = 'Minimalist'
}

export type AspectRatio = '1:1' | '9:16';

export interface Slide {
  id: string;
  slideNumber: number;
  imagePrompt: string;
  text: string;
  imageUrl?: string;
  generatingImage?: boolean;
}

export interface Feed {
  id: string;
  topic: string;
  style: VisualStyle;
  aspectRatio: AspectRatio;
  slides: Slide[];
  hashtags: string[];
  totalWords: number;
}

export interface GenerationStatus {
  step: 'idle' | 'scripting' | 'visualizing' | 'completed' | 'error';
  message: string;
  progress: number;
}
