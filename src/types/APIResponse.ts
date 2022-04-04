import { AxiosError } from 'axios';

interface BaseResponse {
    success: boolean;
}

interface SuccessfulResponse<T> extends BaseResponse {
    success: true;
    data: T;
}

interface FailedResponse extends BaseResponse {
    success: false;
    error: AxiosError;
}

type APIResponse<T> = SuccessfulResponse<T> | FailedResponse;

export default APIResponse;
