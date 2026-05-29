import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Rewrites a Cloudinary delivery URL to serve a small, auto-format (WebP/AVIF),
 * auto-quality, exactly-cropped thumbnail — drastically cutting image decode
 * cost while scrolling. Unsplash URLs get a width hint; others pass through.
 *
 * @param width CSS px the image renders at (we request 2x for retina).
 */
export function thumb(url: string | undefined, width: number, height?: number): string | undefined {
  if (!url) return url

  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const t = ["f_auto", "q_auto", "c_fill", `w_${width}`, height ? `h_${height}` : "", "dpr_2"]
      .filter(Boolean)
      .join(",")
    return url.replace("/upload/", `/upload/${t}/`)
  }

  if (url.includes("images.unsplash.com")) {
    const sep = url.includes("?") ? "&" : "?"
    return `${url}${sep}w=${width * 2}&q=70&auto=format&fit=crop`
  }

  return url
}
