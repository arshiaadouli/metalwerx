import { YARD } from "@/lib/yard";
import { cn } from "@/lib/utils";

// Google's map of the yard, for the home page and the contact page. It loads
// only as it nears the screen. Google's own map stays light in the dark theme.
export function YardMap({ className }) {
  return (
    <iframe
      src={YARD.mapEmbedSrc}
      title={`Map showing ${YARD.name} at ${YARD.address}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className={cn("block w-full rounded-[2px] border border-rule bg-sunk", className)}
    />
  );
}
