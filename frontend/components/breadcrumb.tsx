import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumb = () => {
  const router = useRouter();

  const linkPath = router.asPath.split("/");

  linkPath.shift();

  const crumbs: { breadcrumb: string; href: string }[] = linkPath.map(
    (urlPart: string, i: number) => {
      return {
        breadcrumb: urlPart,
        href: "/" + linkPath.slice(0, i + 1).join("/"),
      };
    }
  );
  return (
    <ul className="mb-3">
      {crumbs.map((crumb, i) => (
        <li
          className={[
            router.asPath === crumb.href ? "underline text-black" : "text-link",
            "inline mr-3",
          ].join(" ")}
        >
          <Link href={crumb.href}>{crumb.breadcrumb}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumb;
