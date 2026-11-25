import { CallUserGetService } from "@/src/lib/fastapiClient";
import Image from "next/image";
export default async function UserPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const response = await CallUserGetService(slug);
    const profile = response.ok ? response.profile : null;
    if(!profile){
        return (
            <div className = "">
                Error....
            </div>
        )
    }
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col w-full max-w-lg gap-6 px-4 py-10">
                    <div className="flex flex-col items-center justify-center gap-3 pb-6 border-b border-(--border)">
                        <Image
                            src="/default-pfp-dark.jpg"
                            alt="Profile Picture"
                            height={80}
                            width={80}
                            className="rounded-full object-cover"
                        />
                        <h1 className="text-2xl font-bold">
                            @{profile.username}
                        </h1>
                        <p className="text-sm text-(--text-secondary)">
                            {profile.reviews.length} reviews
                        </p>
                    </div>

                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">
                            Reviews
                        </h2>
                        <span className="text-sm text-(--text-muted)">
                            {profile.reviews.length} total
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {profile.reviews.length === 0 ? (
                            <p className="text-center text-(--text-muted) py-10">
                                No reviews yet.
                            </p>
                        ) : (
                            profile.reviews.map((review, index) => (
                                <div key={index} className="flex flex-col gap-3 bg-(--bg-secondary) border border-(--border) rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-(--accent)">
                                            {review.full_code}
                                        </span>
                                        <span className="text-sm text-yellow-400">
                                            ★ {review.rating}/5
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-(--text-primary)">
                                        {review.title}
                                    </h3>

                                    {review.professor && (
                                        <p className="text-sm text-(--text-muted)">
                                            Professor: {review.professor}
                                        </p>
                                    )}

                                    <p className="text-sm text-(--text-secondary) leading-relaxed wrap-break-word">
                                        {review.body}
                                    </p>

                                    <div className="flex justify-between items-center border-t border-(--border) pt-3 text-xs text-(--text-secondary)">
                                        <span>Difficulty: {review.difficulty}/10</span>
                                        <span>Grade: {review.grade}</span>
                                        <span>
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}