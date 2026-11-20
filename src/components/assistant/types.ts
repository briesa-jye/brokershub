export type Block = { type: string; [k: string]: unknown };
export type Api = { role: "user" | "assistant"; content: string | Block[] };
export type StreamEvent =
  | { t: "text"; d: string }
  | { t: "final"; stop: string | null; content: Block[] }
  | { t: "usage"; run: string; queries: number }
  | { t: "error"; message: string };
