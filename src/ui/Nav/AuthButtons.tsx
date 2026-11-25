"use client"
import { ProfileModel } from "@/src/lib/types";
import ProfilePicture from "../ProfilePicture";
import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "../Logo";
import { LogIn, SignUp } from "@/src/lib/supabase/auth";
import { useRouter } from "next/navigation";

export default function AuthButtons({ user }: { user: ProfileModel | null }) {
    const [modal, setModal] = useState<"login" | "signup" | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    return (
        <div className="h-16 flex justify-between bg-transparent items-center border-b border-(--border) mt-5 w-full">
            <Logo />
            {!user ? (
                <div className="flex gap-4 items-center text-sm font-bold">
                    <button onClick={() => setModal("login")} className="text-(--text-primary) bg-(--bg-secondary) rounded-md cursor-pointer px-3 py-2 duration-200">
                        Log in
                    </button>
                    <button onClick={() => setModal("signup")} className="bg-(--btn-primary) hover:bg-(--btn-primary-hover) text-white cursor-pointer px-4 py-2 rounded-md duration-200">
                        Sign up
                    </button>
                </div>
            ) : (
                <div className="">
                    <ProfilePicture user = {user} />
                </div>
            )}

            <AnimatePresence>
                {modal && (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setModal(null)}
                        onSubmit={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            startTransition(async () => {
                                const formData = new FormData(e.currentTarget);
                                const email = formData.get("email") as string;
                                const password = formData.get("password") as string;
                                try {
                                    const response = modal === "login"
                                        ? await LogIn(email, password)
                                        : await SignUp(email, password);

                                    if (!response.ok) {
                                        setError(response.error);
                                        return;
                                    }

                                    setModal(null);
                                    router.refresh();
                                } catch {
                                    setError("Something went wrong!");
                                }
                            })

                        }}
                        className="fixed inset-0 z-9999 bg-black/60 flex justify-center items-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-(--bg-secondary) border border-(--border-strong) rounded-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4"
                        >
                            <div className="flex justify-between items-center">
                                <h1 className="text-xl font-bold text-(--text-primary)">
                                    {modal === "login" ? "Log In" : "Sign Up"}
                                </h1>
                                <button
                                    type="button"
                                    onClick={() => { setModal(null); setError(null); }}
                                    className="cursor-pointer">
                                    ✕
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-(--text-secondary)">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="bg-(--bg-primary) border border-(--border) rounded-md px-3 py-2 outline-none duration-300"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-(--text-secondary)">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name = "password"
                                    placeholder="Enter your password"
                                    className="bg-(--bg-primary) border border-(--border) rounded-md px-3 py-2 outline-none duration-300"
                                />
                            </div>
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        role="alert"
                                        className="text-red-400 font-bold rounded-md p-2"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="bg-(--btn-primary) hover:bg-(--btn-primary-hover) cursor-pointer rounded-md py-2 font-bold duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isPending ? "Please wait..." : modal === "login" ? "Log In" : "Sign Up"}
                            </button>

                            <div className="text-sm text-center text-(--text-secondary)">
                                {modal === "login" ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError(null);
                                        setModal(modal === "login" ? "signup" : "login");
                                    }}
                                    className="pl-1 text-(--accent) cursor-pointer"
                                >
                                    {modal === "login" ? "Sign Up" : "Log In"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}