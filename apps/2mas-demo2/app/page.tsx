import Link from "next/link";

export default async function Home() {
  return (
    <div>
      Demo2 start page{" "}
      <Link href="/demo2/some-demo2-page">Some demo2 page</Link>
    </div>
  );
}
