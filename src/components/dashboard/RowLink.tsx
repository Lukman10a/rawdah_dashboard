import Link from "next/link";

export function RowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`block w-full h-full ${className ?? ""}`}>
      {children}
    </Link>
  );
}

export default RowLink;
