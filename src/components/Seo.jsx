import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HOME_TITLE = "পাশাপাশি — আপনার পাশের দোকান";

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isAdmin = pathname.startsWith("/admin");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", isAdmin ? "noindex, nofollow" : "index, follow");

    if (isAdmin) document.title = "অ্যাডমিন | পাশাপাশি";
    else if (pathname === "/cart") document.title = "কার্ট | পাশাপাশি";
    else if (!pathname.startsWith("/product/")) document.title = HOME_TITLE;
  }, [pathname]);

  return null;
}
