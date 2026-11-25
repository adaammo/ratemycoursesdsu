"use server"
import axios, { isAxiosError } from "axios"
import { generateUsername } from "unique-username-generator"
import { APICourseResponse, APIErrorResponse, CoursesResponse, ProfessorStatsResponse, ReviewBase, ReviewInserts, CourseCatalogResponse, ProfileGetResponse, ProfileModel, UserProfileDetails, UserProfilePageResponse } from "./types"
import { ServerClient } from "./supabase/supabaseServer"
import { supabase } from "./supabase/supabase"
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ""
const headers = {
    "content-type": "application/json",
    "API_KEY": process.env.API_KEY ?? ""
    
}
export async function CallCoursesAPI(): Promise<{ ok: true, courses: CoursesResponse } | { ok: false, status: number, detail: string }> {
    try {
        const response = await axios.get<CoursesResponse>(`${API_URL}/courses`, {
            headers
        });
        return {
            ok: true,
            courses: response.data
        }
    }
    catch (error) {
        if (isAxiosError<{ detail: string }>(error)) {
            const status = error.response?.status
            const detail = error.response?.data.detail
            return {
                ok: false,
                status: status ?? 500,
                detail: detail ?? "Interal service error."
            }
        }
    }
    return {
        ok: false,
        status: 500,
        detail: "Something went wrong with our server. Please try again."
    }
}

export async function CallCourseCatalogAPI(course_prefix: string):
    Promise<{ ok: true, courses: CourseCatalogResponse[] } | { ok: false, status: number, detail: string }> {
    try {
        const response = await axios.get<CourseCatalogResponse[]>(
            `${API_URL}/courses/prefix/${encodeURIComponent(course_prefix)}`,
            {
                headers
            }
        );

        return {
            ok: true,
            courses: response.data
        }
    }
    catch (error) {
        if (isAxiosError<{ detail: string }>(error)) {
            const status = error.response?.status
            const detail = error.response?.data.detail

            return {
                ok: false,
                status: status ?? 500,
                detail: detail ?? "Internal service error."
            }
        }
    }

    return {
        ok: false,
        status: 500,
        detail: "Something went wrong with our server. Please try again."
    }
}

export async function CallSingleCourseAPI(course_id: string):
    Promise<{ ok: true, data: APICourseResponse } | { ok: false, status: number, detail: string }> {
    try {
        const response = await axios.get<APICourseResponse>(`${API_URL}/courses/${course_id}`, {
            headers
        })
        const data = response.data
        return {
            ok: true,
            data
        }
    }
    catch (error) {
        if (isAxiosError<{ detail: string }>(error)) {
            const status = error.response?.status
            const detail = error.response?.data.detail
            return {
                ok: false,
                status: status ?? 500,
                detail: detail ?? "Interal service error."
            }
        }
    }
    return {
        ok: false,
        status: 500,
        detail: "Something went wrong with our server. Please try again."
    }
}

export async function PostReviewForm(review: ReviewInserts, course_id: string): Promise<{ ok: true } | { ok: false, status: number, detail: string }> {
    const serverSupabase = await ServerClient();
    const {data: {user}, error} = await serverSupabase.auth.getUser();
    let user_id : string | null = null;
    if(user){
        user_id = user.id
    }
    try {
        await axios.post(`${API_URL}/courses/${course_id}/reviews/create`, {...review, user_id: user_id}, {
            headers
        })
        return { ok: true };
    }
    catch (error) {
        if (isAxiosError<{ detail: string }>(error)) {
            const status = error.response?.status
            const detail = error.response?.data.detail
            return {
                ok: false,
                status: status ?? 500,
                detail: JSON.stringify(detail) ?? "Interal service error."
            }
        }
    }
    return {
        ok: false,
        status: 500,
        detail: "Something went wrong with our server. Please try again."
    }
}

export async function CallProfessorStatsAPI(course_id: string):
    Promise<{ ok: true , stats: ProfessorStatsResponse[]} | { ok: false, status: number, detail: string }> {
    try {
        const response = await axios.get<ProfessorStatsResponse[]>(`${API_URL}/reviews/${course_id}/professors`, {
            headers
        })
        const data = response.data
        return {
            ok: true,
            stats: data
        }
    }
    catch (error) {
        if (isAxiosError<{ detail: string }>(error)) {
            const status = error.response?.status
            const detail = error.response?.data.detail
            return {
                ok: false,
                status: status ?? 500,
                detail: detail ?? "Interal service error."
            }
        }
    }
    return {
        ok: false,
        status: 500,
        detail: "Something went wrong with our server. Please try again."
    }
}

export async function CallProfileGetService(token: string): Promise<ProfileGetResponse | {ok: false, error: string}>{
    try{
        const response = await axios.get<ProfileModel>(`${API_URL}/user/profile`, {
            headers:{
                ...headers,
                "Authorization": `Bearer ${token}`
            } 
        })
        return {ok: true, profile: response.data}
    }
    catch(error){
        if(isAxiosError(error)){
            const msg = error.response?.data.detail as string
            return {
                ok: false,
                error: msg
            }
        }
    }
    return {ok: false, error: "Internal Server Error"};
}
export async function CallProfileCreateService(
    token: string,
): Promise< {ok: true} | {ok: false, error: string}> {
    const username = generateUsername("_", 2, 12);
    try {
        await axios.post(`${API_URL}/user/create/${encodeURIComponent(username)}`, {} ,
            {
                headers: {
                    ...headers,
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        return {ok: true};
    }
    catch(error) {
        if(isAxiosError(error)) {
            const msg = error.response?.data?.detail as string;
            return {
                ok: false,
                error: msg ?? "Failed to create profile"
            };
        }
    }
    return {ok: false, error: "Internal Server Error"};
}

export async function CallUserGetService(username: string): Promise<UserProfilePageResponse | {ok: false, error: string}>{
    try{
        const response = await axios.get<UserProfileDetails>(`${API_URL}/user/profile/${encodeURIComponent(username)}`, {
            headers:{
                ...headers,
            } 
        })
        return {ok: true, profile: response.data}
    }
    catch(error){
        if(isAxiosError(error)){
            const msg = error.response?.data.detail as string
            return {
                ok: false,
                error: msg
            }
        }
    }
    return {ok: false, error: "Internal Server Error"};
}