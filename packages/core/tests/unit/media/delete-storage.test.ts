import { describe, expect, it, vi } from "vitest";

import { deleteMediaStorageFiles, mediaStorageKeys } from "../../../src/media/delete-storage.js";
import type { Storage } from "../../../src/storage/types.js";

describe("media storage deletion", () => {
	it("returns the render key and optional original key", () => {
		expect(mediaStorageKeys({ storageKey: "render.webp", originalStorageKey: null })).toEqual([
			"render.webp",
		]);
		expect(
			mediaStorageKeys({ storageKey: "render.webp", originalStorageKey: "original.jpg" }),
		).toEqual(["render.webp", "original.jpg"]);
	});

	it("attempts both keys even when one deletion fails", async () => {
		const deleteFile = vi
			.fn<(key: string) => Promise<void>>()
			.mockRejectedValueOnce(new Error("missing"))
			.mockResolvedValueOnce();
		const storage = { delete: deleteFile } as unknown as Storage;

		await deleteMediaStorageFiles(storage, {
			storageKey: "render.webp",
			originalStorageKey: "original.jpg",
		});

		expect(deleteFile.mock.calls).toEqual([["render.webp"], ["original.jpg"]]);
	});
});
