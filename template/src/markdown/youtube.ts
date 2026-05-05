import { visit } from "unist-util-visit";
import type { Root, Link } from "mdast";

export default function youtube() {
  return (tree: Root) => {
    visit(tree, "link", (node: Link) => {
      if (!URL.canParse(node.url)) return;
      const video = new URL(node.url);

      let id: string | null = null;
      if (video.hostname.endsWith("youtube.com")) {
        id = video.searchParams.get("v");
      } else if (video.hostname.endsWith("youtu.be")) {
        id = video.pathname.slice(1) || null;
      }

      if (id) {
        (node as unknown as { type: string; value: string }).type = "html";
        (node as unknown as { type: string; value: string }).value =
          `<iframe src="https://www.youtube.com/embed/${id}?rel=0&controls=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="aspect-ratio: 16 / 9; width: 100%; border: 0"></iframe>`;
      }
    });
  };
}
