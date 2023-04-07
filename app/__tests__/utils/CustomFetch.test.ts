import customFetchInstance from "../../scripts/utils/CustomFetch";

describe("CustomFetch", () => {
    test("should create an instance of CustomFetch with default options", () => {
        expect(customFetchInstance.defaultOptions).toEqual({
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    test("should successfully fetch JSON data when the response is ok", async () => {
        const mockSuccessResponse = { success: true };
        const mockFetchPromise = Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockSuccessResponse),
        } as Response);

        const originalFetch = window.fetch;
        window.fetch = jest
            .fn()
            .mockImplementation(
                () => mockFetchPromise
            ) as unknown as typeof window.fetch;

        const result = await customFetchInstance.fetch(
            "https://example.com/success"
        );

        expect(result).toEqual(mockSuccessResponse);

        window.fetch = originalFetch;
    });

    test("should throw an error when the response is not ok", async () => {
        const mockErrorResponse = {
            status: 400,
            statusText: "Bad Request",
        };
        const mockFetchPromise = Promise.resolve({
            ok: false,
            status: mockErrorResponse.status,
            statusText: mockErrorResponse.statusText,
            json: () => Promise.reject(),
        } as Response);

        const originalFetch = window.fetch;
        window.fetch = jest
            .fn()
            .mockImplementation(
                () => mockFetchPromise
            ) as unknown as typeof window.fetch;

        await expect(
            customFetchInstance.fetch("https://example.com/error")
        ).rejects.toThrow(
            `Http error! status: ${mockErrorResponse.status}, message: ${mockErrorResponse.statusText}`
        );

        window.fetch = originalFetch;
    });
});
