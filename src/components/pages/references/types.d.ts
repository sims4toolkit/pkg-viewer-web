export interface ExtractedXmlFile {
  tuningId: bigint;
  filename: string;
  references: bigint[];
  referencedBy: bigint[];
}