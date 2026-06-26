import { useMemo, useState } from 'react';
import { Search, Upload, Trash2, Tag as TagIcon, Users, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import CrmLayout from '@/components/layout/CrmLayout';
import ImportContactsDialog from '@/components/crm/ImportContactsDialog';
import {
  CrmPage, CrmPageHeader, CrmStatGrid, CrmStat,
  CrmPrimaryBtn, CrmGhostBtn, CrmEmptyState,
} from '@/components/crm/CrmUI';
import { deriveTags } from '@/lib/crm/crmService';
import { useContacts, useSuppressions, useDeleteContacts, useAddTag, useUpdateContact } from '@/lib/crm/useCrmQueries';
import { cn } from '@/lib/utils';

function initials(c) {
  const a = (c.first_name || c.email || '?')[0] || '?';
  const b = (c.last_name || '')[0] || '';
  return (a + b).toUpperCase();
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
      <CrmPage>
        <CrmPageHeader
          title="Contacts"
          subtitle="Import, tag, and organize your leads for campaigns."
          actions={
            <ImportContactsDialog
              trigger={
                <CrmPrimaryBtn>
                  <Upload size={15} /> Import contacts
                </CrmPrimaryBtn>
              }
            />
          }
        />

        <div className="mb-6">
          <CrmStatGrid>
            <CrmStat label="Total" value={contacts.length} />
            <CrmStat label="Opted in" value={contacts.filter(c => c.opt_in).length} />
            <CrmStat label="Tags" value={tags.length} />
            <CrmStat label="Suppressed" value={suppressed.size} />
          </CrmStatGrid>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, email, or tag"
              className="crm-input h-11 pl-10"
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

        {selectedIds.length > 0 && (
          <div className="crm-bulk-bar mb-4">
            <span className="text-sm font-semibold text-crm">{selectedIds.length} selected</span>
            <span className="text-crm/30">·</span>
            <button onClick={() => setTagDialogOpen(true)} className="crm-btn-ghost px-3 py-1.5 text-xs">
              <TagIcon size={12} /> Add tag
            </button>
            <button onClick={handleDelete} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
              <Trash2 size={12} /> Delete
            </button>
            <button onClick={() => setSelected(new Set())} className="crm-link ml-auto text-xs">
              Clear
            </button>
          </div>
        )}

        <div className="crm-table-wrap">
          {filtered.length === 0 ? (
            <CrmEmptyState
              icon={Users}
              title={contacts.length > 0 ? 'No matches found' : 'No contacts yet'}
              description={
                contacts.length > 0
                  ? 'Try adjusting your search or tag filter.'
                  : 'Import a CSV or Excel file. We organize your contacts automatically.'
              }
              action={
                !contacts.length && (
                  <ImportContactsDialog
                    trigger={
                      <CrmPrimaryBtn>
                        <Upload size={15} /> Import contacts
                      </CrmPrimaryBtn>
                    }
                  />
                )
              }
            />
          ) : (
            <>
              <div className="sticky top-0 z-10 hidden grid-cols-[40px_1.8fr_1.6fr_1fr_60px] items-center gap-3 border-b border-gray-100 bg-gray-50/95 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 backdrop-blur sm:grid">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                <span>Name</span>
                <span>Email</span>
                <span>Tags</span>
                <span className="text-right">Opt-in</span>
              </div>
              <ul className="divide-y divide-gray-50">
                {filtered.map(c => {
                  const isSuppressed = suppressed.has((c.email || '').toLowerCase());
                  return (
                    <li
                      key={c.id}
                      className={cn(
                        'grid grid-cols-[40px_1fr] items-start gap-3 px-6 py-4 text-sm transition-colors sm:grid-cols-[40px_1.8fr_1.6fr_1fr_60px] sm:items-center',
                        selected.has(c.id) ? 'bg-crm-light/40' : 'hover:bg-crm-subtle/80'
                      )}
                    >
                      <Checkbox
                        className="mt-1 sm:mt-0"
                        checked={selected.has(c.id)}
                        onCheckedChange={() => toggleOne(c.id)}
                      />
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">
                          {initials(c)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900">
                            {[c.first_name, c.last_name].filter(Boolean).join(' ') || '—'}
                          </p>
                          <p className="truncate text-xs text-gray-400 sm:hidden">{c.email}</p>
                        </div>
                      </div>
                      <p className="hidden truncate text-gray-500 sm:block">{c.email}</p>
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
              <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-3 text-xs text-gray-400">
                Showing {filtered.length} of {contacts.length} contacts
              </div>
            </>
          )}
        </div>
      </CrmPage>

      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add tag to {selectedIds.length} contact{selectedIds.length > 1 ? 's' : ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Tag name</Label>
            <Input
              autoFocus
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Seller, Investor, Hot Lead"
              onKeyDown={e => e.key === 'Enter' && handleApplyTag()}
            />
          </div>
          <DialogFooter>
            <CrmGhostBtn onClick={() => setTagDialogOpen(false)}>Cancel</CrmGhostBtn>
            <CrmPrimaryBtn onClick={handleApplyTag} disabled={!newTag.trim()}>Apply tag</CrmPrimaryBtn>
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
      className={cn('crm-chip', active && 'crm-chip-active')}
    >
      {children}
    </button>
  );
}
