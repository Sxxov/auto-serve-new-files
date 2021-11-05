import { promises as fs } from 'fs';
import { posix as pathTool } from 'path';
export class DirectoryPermissionChecker {
    constructor(directory) {
        Object.defineProperty(this, "directory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: directory
        });
    }
    static get PERMITTED_DIRECTORIES_LIST_PATH() {
        return './#directories.json';
    }
    isPermitted() {
        const lowercaseDirectory = this.directory.toLowerCase().trim();
        const resolvedLowercaseDirectory = pathTool.resolve('.', lowercaseDirectory);
        return PermittedDirectories.some((v) => pathTool.resolve('.', v.toLowerCase().trim()) ===
            resolvedLowercaseDirectory);
    }
    static async fetchPermittedDirectories() {
        try {
            return JSON.parse(await fs.readFile(this.PERMITTED_DIRECTORIES_LIST_PATH, {
                encoding: 'utf8',
            }));
        }
        catch {
            await fs.writeFile(this.PERMITTED_DIRECTORIES_LIST_PATH, '[]');
            return [];
        }
    }
}
const PermittedDirectories = await DirectoryPermissionChecker['fetchPermittedDirectories']();
