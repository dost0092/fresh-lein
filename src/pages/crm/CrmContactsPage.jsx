import { useMemo, useState } from 'react';
import { Search, Upload, Trash2, Tag as TagIcon, Users, ShieldCheck, BadgeCheck, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import CrmLayout from '@/components/layout/CrmLayout';
import ImportContactsDialog from '@/components/crm/ImportContactsDialog';
import { deriveTags } from '@/lib/crm/crmService';
import { useContacts, useSuppressions, useDeleteContacts, useAddTag, useUpdateContact } from '@/lib/crm/useCrmQueries';

function initials(c) {
  const a = (c.first_name || c.email || '?')[0] || '?';
  const b = (c.last_name || '')[0] || '';
  return (a + b).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
];

function avatarColor(email = '') {
  const idx = email.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function CrmContactsPage() {
  const { data: contacts = []       } = useContacts();
  const { data: suppressionList = []} = useSuppressions();
  const suppressed = useMemo(() => new Set(suppressionList.map(e => String(e).toLowerCase())), [suppressionList]);
  const tags       = useMemo(() => deriveTags(contacts), [contacts]);
  const deleteMut  = useDeleteContacts();
  const addTagMut  = useAddTag();
  const updateMut  = useUpdateContact();

  const [query, setQuery]             = useState('');
  const [activeTag, setActiveTag]     = useState('all');
  const [selected, setSelected]       = useState(() => new Set());
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [newTag, setNewTag]           = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter(c => {
      if (activeTag !== 'all' && !(c.tags || []).includes(activeTag)) return false;
      if (!q) return true;
      return [c.first_name, c.last_name, c.email, c.phone, (c.tags || []).join(' ')]
        .join(' ').toLowerCase().includes(q);
    });
  }, [contacts, query, activeTag]);

  const allSelected = filtered.length > 0 && filtered.every(c => selected.has(c.id));
  const toggleAll   = () => setSelected(prev => {
    const next = new Set(prev);
    if (allSelected) filtered.forEach(c => next.delete(c.id));
    else filtered.forEach(c => next.add(c.id));
    return next;
  });
  const toggleOne = id => setSelected(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  const selectedIds = Array.from(selected);

  const handleDelete = () => {
    const count = selectedIds.length;
    deleteMut.mutate(selectedIds, {
      onSuccess: () => { toast({ title: `${count} contact${count > 1 ? 's' : ''} deleted` }); setSelected(new Set()); },
      onError: (err) => toast({ title: 'Delete failed', description: err?.message }),
    });
  };

  const handleApplyTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    addTagMut.mutate(
      { ids: selectedIds, tag },
      {
        onSuccess: () => { toast({ title: `Tag "${tag}" applied to ${selectedIds.length} contacts` }); setNewTag(''); setTagDialogOpen(false); setSelected(new Set()); },
        onError: (err) => toast({ title: 'Could not add tag', description: err?.message }),
      }
    );
  };

  return (
    <CrmLayout>
      <div className="flex-1 overflow-y-auto bg-gray-50/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Contacts</h1>
              <p className="mt-0.5 text-sm text-gray-500">Your leads — import, tag, and segment for campaigns.</p>
            </div>
            <ImportContactsDialog
              trigger={
                <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
                  <Upload size={15} /> Import Contacts
                </button>
              }
            />
          </div>

          {/* Stat strip */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Users,     label: 'Total',       value: contacts.length,                        color: 'bg-blue-50 text-blue-600'    },
              { icon: BadgeCheck, label: 'Opted In',   value: contacts.filter(c => c.opt_in).length,  color: 'bg-emerald-50 text-emerald-600'},
              { icon: TagIcon,   label: 'Tags',        value: tags.length,                             color: 'bg-violet-50 text-violet-600' },
              { icon: ShieldCheck,label: 'Suppressed', value: suppressed.size,                         color: 'bg-red-50 text-red-600'       },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${s.color} mb-2`}>
                  <s.icon size={16} />
                </div>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search + tag filters */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, email, or tag…"
                className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <TagChip active={activeTag === 'all'} onClick={() => setActiveTag('all')}>All</TagChip>
                {tags.map(t => (
                  <TagChip key={t} active={activeTag === t} onClick={() => setActiveTag(t)}>{t}</TagChip>
                ))}
              </div>
            )}
          </div>

          {/* Bulk action bar */}
          {selectedIds.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5">
              <span className="text-sm font-semibold text-blue-800">{selectedIds.length} selected</span>
              <span className="text-blue-300">·</span>
              <button
                onClick={() => setTagDialogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <TagIcon size={12} /> Add Tag
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} /> Delete
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="ml-auto text-xs text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            </div>
          )}

          {/* Table */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {filtered.length === 0 ? (
              <EmptyState hasContacts={contacts.length > 0} />
            ) : (
              <>
                {/* Table header */}
                <div className="hidden grid-cols-[40px_1.8fr_1.6fr_1fr_60px] items-center gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:grid">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                  <span>Name</span>
                  <span>Email</span>
                  <span>Tags</span>
                  <span className="text-right">Opt-in</span>
                </div>
                <ul className="divide-y divide-gray-50">
                  {filtered.map(c => {
                    const isSuppressed = suppressed.has((c.email || '').toLowerCase());
                    const colorClass   = avatarColor(c.email);
                    return (
                      <li
                        key={c.id}
                        className={`grid grid-cols-[40px_1fr] items-start gap-3 px-5 py-3.5 text-sm transition-colors sm:grid-cols-[40px_1.8fr_1.6fr_1fr_60px] sm:items-center ${selected.has(c.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50/60'}`}
                      >
                        <Checkbox
                          className="mt-1 sm:mt-0"
                          checked={selected.has(c.id)}
                          onCheckedChange={() => toggleOne(c.id)}
                        />
                        <div className="flex min-w-0 items-center gap-3">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${colorClass}`}>
                            {initials(c)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {[c.first_name, c.last_name].filter(Boolean).join(' ') || '—'}
                            </p>
                            <p className="text-xs text-gray-400 truncate sm:hidden">{c.email}</p>
                          </div>
                        </div>
                        <p className="hidden text-gray-500 truncate sm:block">{c.email}</p>
                        <div className="col-start-2 flex flex-wrap gap-1 sm:col-start-auto">
                          {(c.tags || []).length === 0 ? (
                            <span className="text-xs text-gray-300">—</span>
                          ) : (
                            (c.tags || []).map(t => (
                              <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{t}</span>
                            ))
                          )}
                        </div>
                        <div className="col-start-2 flex items-center sm:col-start-auto sm:justify-end">
                          {isSuppressed ? (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">Suppressed</span>
                          ) : (
                            <Checkbox
                              checked={!!c.opt_in}
                              onCheckedChange={v => updateMut.mutate({ id: c.id, patch: { opt_in: Boolean(v) } })}
                              aria-label="Toggle opt-in"
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-2.5 text-xs text-gray-400">
                  Showing {filtered.length} of {contacts.length} contacts
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tag dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Tag to {selectedIds.length} Contact{selectedIds.length > 1 ? 's' : ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Tag name</Label>
            <Input
              autoFocus
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="e.g. Seller, Investor, Hot Lead"
              onKeyDown={e => e.key === 'Enter' && handleApplyTag()}
            />
          </div>
          <DialogFooter>
            <button onClick={() => setTagDialogOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={handleApplyTag} disabled={!newTag.trim()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40">Apply Tag</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CrmLayout>
  );
}

function TagChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'border-blue-500 bg-blue-600 text-white'
          : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ hasContacts }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Users size={28} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-gray-900">
        {hasContacts ? 'No matches found' : 'No contacts yet'}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500">
        {hasContacts
          ? 'Try adjusting your search or tag filter.'
          : 'Import your leads from a CSV, Excel file, or paste a list of emails.'}
      </p>
      {!hasContacts && (
        <ImportContactsDialog
          trigger={
            <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Upload size={15} /> Import Contacts
            </button>
          }
        />
      )}
    </div>
  );
}
