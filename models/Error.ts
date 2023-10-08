export type RequestError = {
    response: Response,
    detail: string,
    status_code: number | undefined,
}