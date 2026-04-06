"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, X, Mail, Phone, MapPin } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { clientService, type ClientPayload } from "@/services/clientService";
import type { Client } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email"),
  phone: z.string().max(10, "Phone must be at most 10 characters").optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Form Modal ──────────────────────────────────────────────────────────────

function ClientForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Client;
  onSave: (data: ClientPayload) => Promise<void>;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      address: initial?.address ?? "",
    },
  });

  const inputCls =
    "h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 aria-invalid:border-red-500";
  const labelCls =
    "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {initial ? "Edit client" : "New client"}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="space-y-4">
          <div>
            <label className={labelCls}>Full name</label>
            <input
              {...register("name")}
              className={inputCls}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Email</label>
            <input
              {...register("email")}
              type="email"
              className={inputCls}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              Phone{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input {...register("phone")} maxLength={10} className={inputCls} />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              Address{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input {...register("address")} className={inputCls} />
          </div>

          <div className="flex justify-end gap-2 pt-1">
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
          Delete client
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
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Client | undefined>();
  const [deleting, setDeleting] = useState<Client | undefined>();

  const load = async () => {
    setLoading(true);
    try {
      setClients(await clientService.getAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data: ClientPayload) => {
    if (editing) {
      await clientService.update(editing.id, data);
    } else {
      await clientService.create(data);
    }
    setFormOpen(false);
    setEditing(undefined);
    await load();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await clientService.remove(deleting.id);
    setDeleting(undefined);
    await load();
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    setFormOpen(true);
  };

  const openNew = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  return (
    <>
      <Topbar title="Clients" />

      <main className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              All clients
            </h2>
            <p className="text-sm text-gray-500">
              {clients.length} client{clients.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            size="sm"
            onClick={openNew}
            className="cursor-pointer gap-1.5 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
          >
            <Plus className="h-4 w-4" />
            New client
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-sm text-gray-400">Loading…</div>
        ) : clients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500">No clients yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Click &ldquo;New client&rdquo; to add your first one.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(client)}
                      className="cursor-pointer rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleting(client)}
                      className="cursor-pointer rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {client.name}
                </p>

                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Mail className="h-3 w-3 shrink-0" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone className="h-3 w-3 shrink-0" />
                      {client.phone}
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {client.address}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {formOpen && (
        <ClientForm
          initial={editing}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditing(undefined);
          }}
        />
      )}

      {deleting && (
        <DeleteConfirm
          name={deleting.name}
          onConfirm={handleDelete}
          onClose={() => setDeleting(undefined)}
        />
      )}
    </>
  );
}
