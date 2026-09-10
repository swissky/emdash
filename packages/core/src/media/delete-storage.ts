import type { MediaItem } from "../database/repositories/media.js";
import type { Storage } from "../storage/types.js";

export function mediaStorageKeys(
	item: Pick<MediaItem, "storageKey" | "originalStorageKey">,
): string[] {
	return item.originalStorageKey ? [item.storageKey, item.originalStorageKey] : [item.storageKey];
}

export async function deleteMediaStorageFiles(
	storage: Storage,
	item: Pick<MediaItem, "storageKey" | "originalStorageKey">,
): Promise<void> {
	for (const key of new Set(mediaStorageKeys(item))) {
		try {
			await storage.delete(key);
		} catch {
			// Best-effort storage cleanup must not block database deletion.
		}
	}
}
