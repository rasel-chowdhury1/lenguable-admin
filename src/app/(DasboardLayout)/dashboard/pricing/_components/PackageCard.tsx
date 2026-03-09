import { Button } from "@/components/ui/button";
import { PricingPackage } from "@/types";
import { Check, Edit, Sparkles, Trash2 } from "lucide-react";

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-2 mt-4">
      {features.map((f, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-sm text-muted-foreground"
        >
          <Check className="w-4 h-4 text-[#A9F877] mt-0.5 shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

const PackageCard = ({
  pkg,
  onEdit,
  onDelete,
}: {
  pkg: PricingPackage;
  onEdit: (p: PricingPackage) => void;
  onDelete: (p: PricingPackage) => void;
}) => {
  return (
    <div
      className={`relative flex flex-col rounded-xl border overflow-hidden transition-colors duration-200
        ${pkg.isMostPopular ? "border-[#A9F877]" : "border-border"}`}
    >
      {pkg.isMostPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-[#A9F877] text-white text-xs font-semibold px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>

        <div className="mb-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-4xl font-extrabold text-foreground tracking-tight">
              ${pkg.price}
            </span>
            {pkg.perClassPrice && (
              <span className="text-sm text-muted-foreground font-medium">
                (${pkg.perClassPrice.toFixed(2)} per class)
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-[#A9F877] mt-1">
            {pkg.credits} Credit{pkg.credits > 1 ? "s" : ""}
          </p>
        </div>

        <div className="h-px bg-border my-4" />

        <FeatureList features={pkg.features} />

        <div className="flex gap-2 mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onEdit(pkg)}
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-border"
            onClick={() => onDelete(pkg)}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PackageCard;
