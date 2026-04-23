"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";

import {
  useCreateCTAMutation,
  useDeleteCTAMutation,
  useGetCTAQuery,
  useUpdateCTAMutation,
} from "@/redux/features/ctaApi";

interface ICTA {
  _id: string;
  badgeText: string;
  title: string;
  description: string;
  image: string;
}

export default function CTAAdmin() {
  const { data, isLoading } = useGetCTAQuery(undefined);

  const [createCTA, { isLoading: isCreating }] = useCreateCTAMutation();
  const [updateCTA, { isLoading: isUpdating }] = useUpdateCTAMutation();
  const [deleteCTA] = useDeleteCTAMutation();

  const ctaList: ICTA[] = data?.data ? [data.data] : [];

  // CREATE
  const [open, setOpen] = useState(false);
  const [badgeText, setBadgeText] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // EDIT
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editBadgeText, setEditBadgeText] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editImage, setEditImage] = useState("");

  const reset = () => {
    setBadgeText("");
    setTitle("");
    setDescription("");
    setFile(null);
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ badgeText, title, description }));
    if (file) formData.append("file", file);

    try {
      await createCTA(formData).unwrap();
      toast.success("CTA created");
      setOpen(false);
      reset();
    } catch (err: any) {
      toast.error(err?.data?.message || "Create failed");
    }
  };

  const handleEditOpen = (item: ICTA) => {
    setEditId(item._id);
    setEditBadgeText(item.badgeText);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditImage(item.image);
    setEditFile(null);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        badgeText: editBadgeText,
        title: editTitle,
        description: editDescription,
      }),
    );
    if (editFile) formData.append("file", editFile);

    try {
      await updateCTA({ id: editId, formData }).unwrap();
      toast.success("CTA updated");
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCTA(id).unwrap();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 w-full">

      {/* HEADER (LIKE FAQ) */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">CTA Section</h1>

        {!ctaList.length && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add CTA
          </Button>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {ctaList.map((item) => (
          <Card key={item._id}>
            <CardContent className="p-6">

              {/* ACTION BUTTONS RIGHT SIDE */}
              <div className="flex justify-end gap-2 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditOpen(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* DESIGN (UNCHANGED) */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-block bg-white rounded-full px-4 py-2 text-sm text-gray-700 border border-gray-200 mb-5">
                    {item.badgeText}
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                    {item.title}
                  </h2>

                  <p className="text-gray-700">{item.description}</p>
                </div>

                <div className="bg-gray-200 rounded-lg h-96 overflow-hidden relative">
                  <Image
                    src={item.image}
                    alt="CTA"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CREATE MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create CTA</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Badge Text"
            value={badgeText}
            onChange={(e) => setBadgeText(e.target.value)}
          />

          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <DialogFooter>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit CTA</DialogTitle>
          </DialogHeader>

          <Input
            value={editBadgeText}
            onChange={(e) => setEditBadgeText(e.target.value)}
          />

          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <Input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <Input
            type="file"
            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
          />

          {editImage && (
            <Image
              src={editImage}
              alt="preview"
              width={500}
              height={300}
              className="rounded-lg"
            />
          )}

          <DialogFooter>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}