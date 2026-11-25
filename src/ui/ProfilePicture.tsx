"use client"
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { LogOut } from "@/src/lib/supabase/auth";
import { ProfileModel } from "../lib/types";

export default function ProfilePicture({user} : {user: ProfileModel}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <div className="relative">
            <Image
                src="/default-pfp-dark.jpg"
                alt="Basic PFP"
                sizes="50px"
                height={50}
                width={50}
                onClick={() => setOpen(!open)}
                className="rounded-full object-contain cursor-pointer hover:opacity-80 duration-200"
            />

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute flex flex-col p-1 w-40 right-2 top-full mt-2 z-999 bg-(--bg-secondary) border border-(--border) rounded-lg  text-sm shadow-lg"
                    >
                        <button
                            onClick={() => {
                                setOpen(false);
                                router.push(`/profile/${user.username}`);
                            }}
                            className="text-left px-4 py-2 rounded-md hover:bg-(--bg-tertiary) cursor-pointer duration-200"
                        >
                            Profile
                        </button>
                        <button
                            onClick={async () => {
                                await LogOut();
                                setOpen(false);
                                router.refresh();
                            }}
                            className="text-left text-(--accent) px-4 py-2 rounded-md hover:bg-(--bg-tertiary) cursor-pointer duration-200"
                        >
                            Log out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}