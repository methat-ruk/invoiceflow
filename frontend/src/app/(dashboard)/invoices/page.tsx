"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, X, FileText } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { invoiceService, type InvoicePayload } from "@/services/invoiceService";
import { clientService } from "@/services/clientService";
import { projectService } from "@/services/projectService";
import type { Invoice, Client, Project, InvoiceStatus } from "@/types";

// ── Schema ──────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  description: z.string().min(1, "Required"),
  quantity: z.number().min(0.01, "Min 0.01"),
  unitPrice: z.number().min(0, "Min 0"),
});

const schema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  projectId: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  vatRate: z.number().min(0).max(100),
  discount: z.number().min(0),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one item required"),
});

type FormValues = z.infer<typeof schema>;

// ── Status badge ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  SENT: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  PAID: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  OVERDUE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};



// ── Format ──────────────────────────────────────────────────────────────────

const fmt = (n: number | string) =>
  Number(n).toLocaleString("th-TH", { minimumFractionDigits: 2 });

// ── Form Modal ──────────────────────────────────────────────────────────────

function InvoiceForm({
  initial,
  clients,
  projects,
  onSave,
  onClose,
}: {
  initial?: Invoice;
  clients: Client[];
  projects: Project[];
  onSave: (data: InvoicePayload) => Promise<void>;
  onClose: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: initial?.clientId ?? "",
      projectId: initial?.projectId ?? "",
      dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : "",
      vatRate: initial ? Number(initial.vatRate) : 7,
      discount: initial ? Number(initial.discount) : 0,
      notes: initial?.notes ?? "",
      items: initial?.items.map((i) => ({
        description: i.description,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
      })) ?? [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedClientId = useWatch({ control, name: "clientId" });
  const watchedItems = useWatch({ control, name: "items" }) ?? [];
  const watchedVat = useWatch({ control, name: "vatRate" });
  const watchedDiscount = useWatch({ control, name: "discount" });

  const subtotal = watchedItems.reduce(
    (s, i) => s + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
    0,
  );
  const vatAmount =
    Math.round(subtotal * (Number(watchedVat) / 100) * 100) / 100;
  const total = subtotal + vatAmount - (Number(watchedDiscount) || 0);

  const filteredProjects = projects.filter(
    (p) => p.clientId === watchedClientId,
  );

  const inputCls =
    "h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 scheme-light dark:scheme-dark";
  const labelCls =
    "mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {initial ? "Edit invoice" : "New invoice"}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit((data) => {
            const d = data as unknown as FormValues;
            return onSave({ ...d, projectId: d.projectId || undefined });
          })}
          noValidate
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
            {/* Client + Project */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Client</label>
                <select
                  {...register("clientId")}
                  className={inputCls}
                  aria-invalid={!!errors.clientId}
                >
                  <option value="">— Select —</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.clientId.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls}>
                  Project <span className="text-gray-400">(optional)</span>
                </label>
                <select {...register("projectId")} className={inputCls}>
                  <option value="">— None —</option>
                  {filteredProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due date + VAT + Discount */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Due date</label>
                <input
                  {...register("dueDate")}
                  type="date"
                  className={`${inputCls} scheme-light dark:scheme-dark`}
                  aria-invalid={!!errors.dueDate}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls}>VAT (%)</label>
                <input
                  {...register("vatRate", {
                    setValueAs: (v) => (v === "" || v === undefined ? 7 : Number(v)),
                  })}
                  type="number"
                  step="0.01"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Discount (฿){" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  {...register("discount", {
                    setValueAs: (v) => (v === "" || v === undefined ? 0 : Number(v)),
                  })}
                  type="number"
                  step="0.01"
                  placeholder="0"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Items
                </label>
                <button
                  type="button"
                  onClick={() =>
                    append({ description: "", quantity: 1, unitPrice: 0 })
                  }
                  className="flex cursor-pointer items-center gap-1 text-xs text-violet-600 hover:underline dark:text-violet-400"
                >
                  <Plus className="h-3 w-3" /> Add item
                </button>
              </div>
              {errors.items?.root && (
                <p className="mb-2 text-xs text-red-500">
                  {errors.items.root.message}
                </p>
              )}
              <div className="space-y-2">
                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-start"
                  >
                    <div>
                      {idx === 0 && (
                        <p className="mb-1 text-xs text-gray-400">
                          Description
                        </p>
                      )}
                      <input
                        {...register(`items.${idx}.description`)}
                        placeholder="Service / Product"
                        className={inputCls}
                        aria-invalid={!!errors.items?.[idx]?.description}
                      />
                      {errors.items?.[idx]?.description && (
                        <p className="mt-0.5 text-xs text-red-500">
                          {errors.items[idx]!.description!.message}
                        </p>
                      )}
                    </div>
                    <div>
                      {idx === 0 && (
                        <p className="mb-1 text-xs text-gray-400">Qty</p>
                      )}
                      <input
                        {...register(`items.${idx}.quantity`, {
                          setValueAs: (v) => (v === "" || v === undefined ? 0 : Number(v)),
                        })}
                        type="number"
                        step="0.01"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      {idx === 0 && (
                        <p className="mb-1 text-xs text-gray-400">Unit price</p>
                      )}
                      <input
                        {...register(`items.${idx}.unitPrice`, {
                          setValueAs: (v) => (v === "" || v === undefined ? 0 : Number(v)),
                        })}
                        type="number"
                        step="0.01"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      {idx === 0 && (
                        <p className="mb-1 text-xs text-gray-400 opacity-0">
                          -
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        disabled={fields.length === 1}
                        className="flex h-9 w-8 cursor-pointer items-center justify-center rounded-md text-red-500 hover:bg-red-100 hover:text-red-600  dark:text-red-500 dark:hover:bg-red-300 dark:hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={labelCls}>
                Notes <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                {...register("notes")}
                rows={2}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            {/* Summary */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>฿{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>VAT ({watchedVat}%)</span>
                  <span>฿{fmt(vatAmount)}</span>
                </div>
                {Number(watchedDiscount) > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Discount</span>
                    <span>-฿{fmt(watchedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-1 font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-100">
                  <span>Total</span>
                  <span>฿{fmt(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 justify-end gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="cursor-pointer bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
            >
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm ──────────────────────────────────────────────────────────

function DeleteConfirm({
  name,
  onConfirm,
  onClose,
}: {
  name: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Delete invoice
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={loading}
            onClick={handleConfirm}
            className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

const STATUSES: InvoiceStatus[] = ["DRAFT", "SENT", "PAID", "OVERDUE"];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | undefined>();
  const [deleting, setDeleting] = useState<Invoice | undefined>();

  const load = async () => {
    setLoading(true);
    try {
      const [inv, cli, pro] = await Promise.all([
        invoiceService.getAll(),
        clientService.getAll(),
        projectService.getAll(),
      ]);
      setInvoices(inv);
      setClients(cli);
      setProjects(pro);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data: InvoicePayload) => {
    if (editing) {
      await invoiceService.update(editing.id, data);
    } else {
      await invoiceService.create(data);
    }
    setFormOpen(false);
    setEditing(undefined);
    await load();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await invoiceService.remove(deleting.id);
    setDeleting(undefined);
    await load();
  };

  const handleStatusChange = async (
    invoice: Invoice,
    status: InvoiceStatus,
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoice.id ? { ...inv, status } : inv)),
    );
    await invoiceService.update(invoice.id, { status });
  };

  return (
    <>
      <Topbar title="Invoices" />

      <main className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              All invoices
            </h2>
            <p className="text-sm text-gray-500">
              {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
            disabled={clients.length === 0}
            title={clients.length === 0 ? "Add a client first" : undefined}
            className="cursor-pointer gap-1.5 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            New invoice
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-sm text-gray-400">Loading…</div>
        ) : invoices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <FileText className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-500">No invoices yet</p>
            <p className="mt-1 text-xs text-gray-400">
              {clients.length === 0
                ? "Add a client first, then create an invoice."
                : "Click \u201cNew invoice\u201d to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    Invoice
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    Due date
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-950">
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {inv.client.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {new Date(inv.dueDate).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                      ฿{fmt(inv.total)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[inv.status]}`}>
                          {inv.status}
                        </span>
                        <select
                          value={inv.status}
                          onChange={(e) => handleStatusChange(inv, e.target.value as InvoiceStatus)}
                          className="h-6 rounded-md border border-gray-200 bg-white px-1.5 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 scheme-light dark:scheme-dark"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditing(inv);
                            setFormOpen(true);
                          }}
                          className="cursor-pointer rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleting(inv)}
                          className="cursor-pointer rounded-md p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 dark:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {formOpen && (
        <InvoiceForm
          initial={editing}
          clients={clients}
          projects={projects}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditing(undefined);
          }}
        />
      )}

      {deleting && (
        <DeleteConfirm
          name={deleting.invoiceNumber}
          onConfirm={handleDelete}
          onClose={() => setDeleting(undefined)}
        />
      )}
    </>
  );
}
