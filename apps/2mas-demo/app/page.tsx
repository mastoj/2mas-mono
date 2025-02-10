import Link from "next/link";

export default async function Home() {
  return (
    <div>
      Demo start page <Link href="/some-page">Some page</Link>
    </div>
  );
}
