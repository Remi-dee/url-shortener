export interface Url {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  visits: number;
  lastVisited?: Date;
}
