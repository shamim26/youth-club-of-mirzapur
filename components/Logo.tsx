import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center">
        <Image
          src="/logo-x.png"
          alt="Youth Club of Mirzapur Logo"
          width={100}
          height={100}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
