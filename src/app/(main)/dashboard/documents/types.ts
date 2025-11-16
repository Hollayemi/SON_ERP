export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  relatedTo?: string;
  uploadedBy: string;
  uploadedDate: string;
  version: number;
  tags: string[];
  description?: string;
}
