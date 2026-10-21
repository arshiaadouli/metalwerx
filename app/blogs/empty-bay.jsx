import { Bundle } from "@/components/metal/metal";
import { cn } from "@/lib/utils";

// A slice of the rack whose picked bay is empty: its arm lit as on the home
// page rack, nothing resting on it, and a stamp where a metal's code and name
// would be. Stocked bays on either side are cut off by the edges of the slice,
// so the gap reads as a gap. With `stocked` false the neighbours are empty too.
// The blog's not-found and error pages stand it beside their message, and it
// is hidden from assistive technology because the page says the same in words.
export default function EmptyBay({ code, label, stocked = true, className }) {
  return (
    <div
      aria-hidden="true"
      className={cn("on-rack overflow-hidden rounded-[2px] bg-rack pt-10 pb-7 text-rack-ink sm:pt-12", className)}
    >
      <div className="flex justify-center gap-6 sm:gap-8">
        <Bay>{stocked && <Bundle slug="copper" />}</Bay>
        <Bay picked code={code} label={label} />
        <Bay>{stocked && <Bundle slug="aluminium" />}</Bay>
      </div>
    </div>
  );
}

function Bay({ picked = false, code, label, children }) {
  return (
    <div className="w-40 shrink-0 sm:w-52">
      <div className="aspect-[220/150]">{children}</div>
      <div className={cn("mt-0.5 h-1.5 rounded-[1px]", picked ? "bg-rack-ink" : "bg-rack-arm")} />
      {label && (
        <p className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          {code && <span className="type-code text-2xl">{code}</span>}
          <span className="text-sm font-semibold text-rack-ink sm:text-[0.9375rem]">{label}</span>
        </p>
      )}
    </div>
  );
}
