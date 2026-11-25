"use server"
import { CallProfileCreateService } from "../fastapiClient";
import { ServerClient } from "./supabaseServer";

export async function getSession(): Promise<{ ok: false, error: string } | { ok: true, token: string | undefined }> {
    const serverSupabase = await ServerClient();
    const { data: { session }, error } = await serverSupabase.auth.getSession();
    if (error) {
        return { ok: false, error: error.message };
    }
    if (!session) {
        return { ok: true, token: undefined }
    }
    return { ok: true, token: session?.access_token }
}

export async function LogIn(email: string, password: string): Promise<{ ok: false, error: string } | { ok: true }> {
    const serverSupabase = await ServerClient();
    const { data, error } = await serverSupabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return {
            ok: false,
            error: error.message,
        };
    }
    return {
        ok: true,
    }
}
export async function SignUp(email: string, password: string): Promise<{ ok: false, error: string } | { ok: true }> {
    const serverSupabase = await ServerClient();
    if (!email || !password) {
        return {
            ok: false,
            error: "All required fields not filled."
        }
    }
    if (password.length < 6) {
        return {
            ok: false,
            error: "Password must be at least 6 characters."
        }
    }
    const passCheck = /[!@#$%^&*(),.?":{}|<>]/
    if (!passCheck.test(password)) {
        return {
            ok: false,
            error: "Password must include a special character."
        }
    }
    const { error } = await serverSupabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
    });
    if (error) {
        return { ok: false, error: error.message };
    }
    const session = await getSession();
    console.log(session);
    if (session.ok && session.token) {
        await CallProfileCreateService(session.token);
    }
    return { ok: true }
}
export async function LogOut():
    Promise<{ ok: true } | { ok: false, error: string }> {
    const serverSupabase = await ServerClient();
    const { error } = await serverSupabase.auth.signOut();

    if (error) {
        return {
            ok: false,
            error: error.message
        };
    }

    return { ok: true };
}