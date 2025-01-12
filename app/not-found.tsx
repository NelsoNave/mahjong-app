import Image from "next/image";
import Link from "next/link";

const Button = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className="transform rounded-lg border border-amazon bg-white px-6 py-3 transition-all duration-300 ease-in-out hover:scale-105"
    >
      {children}
    </Link>
  );
};

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 px-4 py-8">
      <p className="max-w-md text-center text-lg font-semibold text-gray-800">
        お探しのページは見つかりませんでした
      </p>
      <Image
        src="/icon-not-found.png"
        alt="Page Not Found"
        width={200}
        height={200}
        className="mb-6 h-48 w-48 object-contain"
      />
      <Button href="/">トップに戻る</Button>
    </div>
  );
}
