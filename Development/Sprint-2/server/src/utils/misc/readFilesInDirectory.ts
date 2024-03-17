import fs from "fs";

export function readFilesInDirectory(directoryPath: string): string[] {
  try {
    if (!fs.existsSync(directoryPath)) {
      console.error("Directory does not exist:", directoryPath);
      return [];
    }
    const files: string[] = fs.readdirSync(directoryPath);
    return files;
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}
