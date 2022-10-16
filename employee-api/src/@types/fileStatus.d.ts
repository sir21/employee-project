// @types.fileStatus.ts
export interface IFileStatus {
    name: string;
    status:  'in_progress' | 'error' | 'completed';
    count: number;
}