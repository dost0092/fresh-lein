import { useMemo, useState } from 'react';
import { Search, Upload, Trash2, Tag as TagIcon, Users, ShieldCheck, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import ImportContactsDialog from '@/components/crm/ImportContactsDialog';
import { deriveTags } from '@/lib/crm/crmService';
import {
  useContacts,
  useSuppressions,
  useDeleteContacts,
  useAddTag,
  useUpdateContact,
} from '@/lib/crm/useCrmQueries';

function initials(c) {
  const a = (c.first_name || c.email || '?')[0] || '?';
  const b = (c.last_name || '')[0] || '';
  return (a + b).toUpperCase();
}

export default function CrmContactsPage() {
  const { data: contacts = [] } = useContacts();
  const { data: suppressionList = [] } = useSuppressions();
  const suppressed = useMemo(
    () => new Set(suppressionList.map((e) => String(e).toLowerCase())),
    [suppressionList]
  );
  const tags = useMemo(() => deriveTags(contacts), [contacts]);
  const deleteMut = useDeleteContacts();
  const addTagMut = useAddTag();
  const updateMut = useUpdateContact();

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [selected, setSelected] = useState(() => new Set());
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      if (activeTag !== 'all' && !(c.tags || []).includes(activeTag)) return false;
      if (!q) return true;
      return [c.first_name, c.last_name, c.email, c.phone, (c.tags || []).join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [contacts, query, activeTag]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) filtered.forEach((c) => next.delete(c.id));
      else filtered.forEach((c) => next.add(c.id));
      return next;
    });
  };

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedIds = Array.from(selected);

  const handleDelete = () => {
    if (!selectedIds.length) return;
    const count = selectedIds.length;
    deleteMut.mutate(selectedIds, {
      onSuccess: () => toast({ title: 'Deleted', description: `${count} contact(s) removed.` }),
      onError: (err) => toast({ title: 'Delete failed', description: err?.message }),
    });
    setSelected(new Set());
  };

  const handleApplyTag = () => {
    if (!newTag.trim()) return;
    const tag = newTag.trim();
    const count = selectedIds.length;
    addTagMut.mutate(
      { ids: selectedIds, tag },
      {
        onSuccess: () => toast({ title: 'Tag applied', description: `“${tag}” added to ${count} contact(s).` }),
        onError: (err) => toast({ title: 'Could not add tag', description: err?.message }),
      }
    );
    setNewTag('');
    setTagDialogOpen(false);
    setSelected(new Set());
  };

  return (
    <AppLayout>
    <div className="flex-1 overflow-y-auto">
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your leads and clients. Import, tag, and segment them for campaigns.
          </p>
        </div>
        <ImportContactsDialog
          trigger={
            <Button className="gap-2">
              <Upload className="h-4 w-4" /> Import contacts
            </Button>
          }
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} label="Total" value={contacts.length} />
        <StatCard icon={BadgeCheck} label="Opted in" value={contacts.filter((c) => c.opt_in).length} />
        <StatCard icon={TagIcon} label="Tags" value={tags.length} />
        <StatCard icon={ShieldCheck} label="Suppressed" value={suppressed.size} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone, tag…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <TagChip active={activeTag === 'all'} onClick={() => setActiveTag('all')}>
            All
          </TagChip>
          {tags.map((t) => (
            <TagChip key={t} active={activeTag === t} onClick={() => setActiveTag(t)}>
              {t}
            </TagChip>
          ))}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <span className="font-medium">{selectedIds.length} selected</span>
          <span className="text-muted-foreground">·</span>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setTagDialogOpen(true)}>
            <TagIcon className="h-3.5 w-3.5" /> Add tag
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-rose-600" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState hasContacts={contacts.length > 0} />
        ) : (
          <>
            {/* Header (desktop) */}
            <div className="hidden grid-cols-[36px_1.6fr_1.4fr_1fr_44px] items-center gap-3 border-b border-border bg-neutral-50/70 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
              <Checkbox checked={allVisibleSelected} onCheckedChange={toggleAll} aria-label="Select all" />
              <span>Name</span>
              <span>Email</span>
              <span>Tags</span>
              <span className="text-right">Opt-in</span>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((c) => {
                const isSuppressed = suppressed.has((c.email || '').toLowerCase());
                return (
                  <li
                    key={c.id}
                    className="grid grid-cols-[36px_1fr] items-start gap-3 px-4 py-3 text-sm sm:grid-cols-[36px_1.6fr_1.4fr_1fr_44px] sm:items-center"
                  >
                    <Checkbox
                      className="mt-1 sm:mt-0"
                      checked={selected.has(c.id)}
                      onCheckedChange={() => toggleOne(c.id)}
                      aria-label={`Select ${c.email}`}
                    />
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                        {initials(c)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {[c.first_name, c.last_name].filter(Boolean).join(' ') || '—'}
                        </p>
                        <p className="truncate text-xs text-muted-foreground sm:hidden">{c.email}</p>
                      </div>
                    </div>
                    <p className="hidden truncate text-muted-foreground sm:block">{c.email}</p>
                    <div className="col-start-2 flex flex-wrap gap-1 sm:col-start-auto">
                      {(c.tags || []).length === 0 ? (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      ) : (
                        (c.tags || []).map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px]">
                            {t}
                          </Badge>
                        ))
                      )}
                    </div>
                    <div className="col-start-2 flex items-center gap-2 sm:col-start-auto sm:justify-end">
                      {isSuppressed ? (
                        <Badge variant="destructive" className="text-[10px]">
                          Suppressed
                        </Badge>
                      ) : (
                        <Checkbox
                          checked={!!c.opt_in}
                          onCheckedChange={(v) => updateMut.mutate({ id: c.id, patch: { opt_in: Boolean(v) } })}
                          aria-label="Toggle opt-in"
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add a tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="bulk-tag">Tag name</Label>
            <Input
              id="bulk-tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="e.g. Seller, Investor, Hot Lead"
              onKeyDown={(e) => e.key === 'Enter' && handleApplyTag()}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyTag} disabled={!newTag.trim()}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function TagChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-white text-muted-foreground hover:bg-neutral-50'
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ hasContacts }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Users className="h-6 w-6" />
      </span>
      <h3 className="mt-3 text-base font-semibold">{hasContacts ? 'No matches' : 'No contacts yet'}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasContacts
          ? 'Try a different search or tag filter.'
          : 'Import your leads from a CSV, Excel file, or by pasting a list of emails to get started.'}
      </p>
      {!hasContacts && (
        <ImportContactsDialog
          trigger={
            <Button className="mt-4 gap-2">
              <Upload className="h-4 w-4" /> Import contacts
            </Button>
          }
        />
      )}
    </div>
  );
}
