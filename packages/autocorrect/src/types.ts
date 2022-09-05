export interface FormatResult {
  out: string
  error: string
  raw?: string
  enable?: boolean
}

export type FormatFor = (
  source: string,
  filename: string,
) => Promise<FormatResult>
