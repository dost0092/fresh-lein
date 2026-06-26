import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as crm from '@/lib/crm/crmService';

const KEYS = {
  contacts:    ['crm', 'contacts'],
  suppressions:['crm', 'suppressions'],
  campaigns:   ['crm', 'campaigns'],
  senders:     ['crm', 'senders'],
};

export function useContacts() {
  return useQuery({ queryKey: KEYS.contacts, queryFn: crm.listContacts });
}

export function useSuppressions() {
  return useQuery({ queryKey: KEYS.suppressions, queryFn: crm.listSuppressions });
}

export function useCampaigns() {
  return useQuery({ queryKey: KEYS.campaigns, queryFn: crm.listCampaigns });
}

export function useImportContacts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rows) => crm.importContacts(rows),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.contacts }),
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => crm.updateContact(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.contacts }),
  });
}

export function useDeleteContacts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids) => crm.deleteContacts(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.contacts }),
  });
}

export function useAddTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, tag }) => crm.addTagToContacts(ids, tag),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.contacts }),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => crm.deleteCampaign(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.campaigns }),
  });
}

export function useSaveDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (campaign) => crm.saveDraft(campaign),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.campaigns }),
  });
}

export function useSendCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => crm.sendCampaign(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.campaigns });
      qc.invalidateQueries({ queryKey: KEYS.contacts });
    },
  });
}

/* ─── Sender account hooks ─────────────────────────────────────────── */

export function useSenders() {
  return useQuery({ queryKey: KEYS.senders, queryFn: crm.listSenders });
}

export function useVerifySender() {
  return useMutation({ mutationFn: (params) => crm.verifySmtpConnection(params) });
}

export function useConnectSender() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params) => crm.connectSender(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.senders }),
  });
}

export function useDeleteSender() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => crm.deleteSender(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.senders }),
  });
}

export function useSendCampaignViaSmtp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, senderAccountId, recipients }) =>
      crm.sendCampaignViaSmtp(payload, senderAccountId, recipients),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.campaigns });
      qc.invalidateQueries({ queryKey: KEYS.senders });
    },
  });
}
