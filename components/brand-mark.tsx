import Image from "next/image";

export function BrandMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return <Image src="/ai-quest-mark.svg" alt="" aria-hidden width={size} height={size} className={className} priority/>;
}
