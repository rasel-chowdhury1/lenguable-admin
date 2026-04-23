/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

import {
  useGetCTA2Query,
  useCreateCTA2Mutation,
  useUpdateCTA2Mutation,
  useDeleteCTA2Mutation,
} from "@/redux/features/cta2Api";

export default function CTA2() {
  const { data, isLoading } = useGetCTA2Query(undefined);

  const [createCTA2] = useCreateCTA2Mutation();
  const [updateCTA2] = useUpdateCTA2Mutation();
  const [deleteCTA2] = useDeleteCTA2Mutation();

  const ctaList = data?.data || [];
  console.log(ctaList, "Cta2 ==>");

  // CREATE STATE
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // EDIT STATE
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // RESET
  const reset = () => {
    setTitle("");
    setDescription("");
  };

  // CREATE
  const handleCreate = async () => {
    try {
      await createCTA2({ title, description }).unwrap();
      toast.success("CTA2 created");
      setOpen(false);
      reset();
    } catch {
      toast.error("Create failed");
    }
  };

  // OPEN EDIT
  const handleEditOpen = (item: any) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditOpen(true);
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      await updateCTA2({
        id: editId,
        data: {
          title: editTitle,
          description: editDescription,
        },
      }).unwrap();

      toast.success("CTA2 updated");
      setEditOpen(false);
    } catch {
      toast.error("Update failed");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteCTA2(id).unwrap();
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
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">CTA2 Section</h1>

        {!ctaList.length && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {ctaList.map((item: any) => (
          <Card key={item._id}>
            <CardContent className="p-6">
              {/* ACTIONS */}
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

              {/* CONTENT */}
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CREATE MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create CTA2</DialogTitle>
          </DialogHeader>

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

          <DialogFooter>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit CTA2</DialogTitle>
          </DialogHeader>

          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <Input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <DialogFooter>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
