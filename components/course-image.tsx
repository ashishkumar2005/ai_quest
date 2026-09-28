import Image from "next/image";

export function CourseImage({src,alt,className,fill=false,width,height,sizes}:{src:string;alt:string;className?:string;fill?:boolean;width?:number;height?:number;sizes?:string}){
  const unoptimized=src.startsWith("data:")||src.startsWith("blob:");
  return <Image src={src||"/images/unit-1.svg"} alt={alt} className={className} fill={fill} width={fill?undefined:width??640} height={fill?undefined:height??360} sizes={sizes} unoptimized={unoptimized}/>
}
