export type BulletRewrite = {
  original: string;
  improved: string;
  reason: string;
};

export type Analysis = {
  score: number;
  oneLineVerdict: string;
  strengths: string[];
  gaps: string[];
  atsKeywords: string[];
  bulletRewrites: BulletRewrite[];
  coverLetterHook: string;
  nextSteps: string[];
};

export type AnalyzeResponse = {
  id: string;
  score: number;
  oneLineVerdict: string;
  strengthsCount: number;
  gapsCount: number;
  atsKeywordsCount: number;
  bulletRewritesCount: number;
};

export type ReportResponse =
  | { paid: true; analysis: Analysis }
  | { paid: false; reason: string };
