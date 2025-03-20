import { AlertTriangle, FileUp } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionUrl?: string;
  actionLabel?: string;
}

const EmptyState = ({
  title = "Aucun document trouvé",
  description = "Vous n'avez pas encore téléversé de permis de conduire dans notre système.",
  actionUrl = "/upload",
  actionLabel = "Téléverser maintenant"
}: EmptyStateProps) => {
  return (
    <div className="text-center py-16 bg-card rounded-xl border border-border shadow-sm animate-in fade-in zoom-in-95 duration-500">
      <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {description}
      </p>
      {actionUrl && (
        <Link href={actionUrl}>
          <Button variant="primary" className="transition-all duration-300 hover:shadow-lg flex items-center gap-2 px-5 py-2.5">
            <FileUp size={18} />
            <span>{actionLabel}</span>
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;