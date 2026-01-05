export interface TrackModel {
  id: string;
  title: string;
  artist: string;
  description?: string;
  createdAt: Date;
  duration: number;
  category: string;
  coverImage?: string;
  file: Blob;
  size: number;
}
