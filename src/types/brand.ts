export interface Brand {
  id: string
  name: string
  origin: string
  tagline?: string
  /** The brand's single most popular product, shown on hover/tap reveal */
  flagshipProductId?: string
}
