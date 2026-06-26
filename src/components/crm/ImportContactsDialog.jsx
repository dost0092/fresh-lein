import { useRef, useState } from 'react';
import { Upload, ClipboardPaste, FileSpreadsheet, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { parseFile, parsePasted, validateRows } from '@/lib/crm/parseContacts';
import { useImportContacts } from '@/lib/crm/useCrmQueries';

const emptyReview = { valid: [], invalid: [], duplicates: 0 };

export default function ImportContactsDialog({ trigger }) {
  const [open, setOpen] = useState(false);
  const [pasted, setPasted] = useState('');
  const [review, setReview] = useState(emptyReview);
  const [fileName, setFileName] = useState('');
  const [tag, setTag] = useState('');
  const [optIn, setOptIn] = useState(true);
  const importMutation = useImportContacts();
  const busy = importMutation.isPending;
  const fileRef = useRef(null);

  const reset = () => {
    setPasted('');
    setReview(emptyReview);
    setFileName('');
    setTag('');
    setOptIn(true);
  };

  const runReview = (rows) => setReview(validateRows(rows));

  const handlePaste = async (value) => {
    setPasted(value);
    if (value.trim()) runReview(await parsePasted(value));
    else setReview(emptyReview);
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const rows = await parseFile(file);
      runReview(rows);
      if (!rows.length) {
        toast({ title: 'No rows found', description: 'We could not read any contacts from that file.' });
      }
    } catch (err) {
      toast({ title: 'Could not read file', description: err?.message || 'Unsupported file.' });
    }
  };

  const handleImport = async () => {
    if (!review.valid.length) return;
    const tags = tag.trim() ? [tag.trim()] : [];
    const rows = review.valid.map((r) => ({ ...r, tags: [...(r.tags || []), ...tags], opt_in: optIn }));
    try {
      const result = await importMutation.mutateAsync(rows);
      toast({
        title: 'Contacts imported',
        description: `${result.added} added · ${result.updated} updated${result.skipped ? ` · ${result.skipped} skipped` : ''}.`,
      });
      reset();
      setOpen(false);
    } catch (err) {
      toast({ title: 'Import failed', description: err?.message || 'Could not save contacts.' });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import contacts</DialogTitle>
          <DialogDescription>
            Paste emails or upload a CSV / Excel file. We auto-detect columns like name, email, and phone.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste" className="gap-2">
              <ClipboardPaste className="h-4 w-4" /> Paste
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" /> Upload file
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="mt-3">
            <Textarea
              value={pasted}
              onChange={(e) => handlePaste(e.target.value)}
              placeholder={'jane@example.com\nMike Ross <mike@example.com>\nsara@example.com'}
              className="min-h-[140px] font-mono text-sm"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              One email per line, comma-separated, or “Name &lt;email&gt;”. CSV with a header row works too.
            </p>
          </TabsContent>

          <TabsContent value="upload" className="mt-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-neutral-50 px-4 py-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <FileSpreadsheet className="h-7 w-7 text-muted-foreground" />
              <span className="text-sm font-medium">
                {fileName || 'Click to choose a .csv or .xlsx file'}
              </span>
              <span className="text-xs text-muted-foreground">Max 50 contacts will be imported on the demo plan.</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls,text/csv"
              className="hidden"
              onChange={handleFile}
            />
          </TabsContent>
        </Tabs>

        {(review.valid.length > 0 || review.invalid.length > 0) && (
          <div className="space-y-3 rounded-lg border border-border bg-neutral-50/60 p-3">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> {review.valid.length} valid
              </span>
              {review.duplicates > 0 && (
                <span className="rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-700">
                  {review.duplicates} duplicate{review.duplicates === 1 ? '' : 's'}
                </span>
              )}
              {review.invalid.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 font-medium text-rose-700">
                  <AlertTriangle className="h-3.5 w-3.5" /> {review.invalid.length} invalid
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="import-tag" className="text-xs">
                  Tag everyone (optional)
                </Label>
                <Input
                  id="import-tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Buyer, Hot Lead"
                  className="h-9"
                />
              </div>
              <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
                <Checkbox checked={optIn} onCheckedChange={(v) => setOptIn(Boolean(v))} />
                <span>Confirmed opt-in (consent to contact)</span>
              </label>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={busy || review.valid.length === 0}>
            Import {review.valid.length > 0 ? review.valid.length : ''} contact
            {review.valid.length === 1 ? '' : 's'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
