import Image from "next/image"
export default function Logo() {
    return (
        <Image
            loading="eager"
            src="/ratemycourse-dark.svg"
            alt="RateMyCourse"
            width={180}
            height={38}
        />
    )
}
