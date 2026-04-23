/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Loader2, Pencil, Trash2, Plus, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";

import {
  useCreateOurStoryMutation,
  useDeleteOurStoryMutation,
  useGetAllOurStoryQuery,
  useUpdateOurStoryMutation,
} from "@/redux/features/ourStoryApi";

interface IOurStoryData {
  _id: string;
  sectionTitle: string;
  paragraphs: string[];
  signature: string;
  founderImage: string;
}

const ParagraphFields = ({
  paragraphs,
  setParagraphs,
}: {
  paragraphs: string[];
  setParagraphs: (value: string[]) => void;
}) => {
  const handleChange = (index: number, value: string) => {
    const updated = [...paragraphs];
    updated[index] = value;
    setParagraphs(updated);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, ""]);
  };

  const removeParagraph = (index: number) => {
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Paragraphs</label>
        <Button variant="outline" size="sm" onClick={addParagraph}>
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>

      {paragraphs.map((paragraph, index) => (
        <div key={index} className="space-y-2">
          <Textarea
            rows={3}
            value={paragraph}
            placeholder={`Paragraph ${index + 1}`}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          {paragraphs.length > 1 && (
            <button
              type="button"
              onClick={() => removeParagraph(index)}
              className="text-xs text-red-500"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default function OurStory() {
  const { data, isLoading } = useGetAllOurStoryQuery(undefined);

  const [createOurStory, { isLoading: isCreating }] =
    useCreateOurStoryMutation();

  const [updateOurStory, { isLoading: isUpdating }] =
    useUpdateOurStoryMutation();

  const [deleteOurStory] = useDeleteOurStoryMutation();

  const sections: IOurStoryData[] = data?.data || [];

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [sectionTitle, setSectionTitle] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>([""]);
  const [signature, setSignature] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [editId, setEditId] = useState("");
  const [editSectionTitle, setEditSectionTitle] = useState("");
  const [editParagraphs, setEditParagraphs] = useState<string[]>([""]);
  const [editSignature, setEditSignature] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editCurrentImage, setEditCurrentImage] = useState("");

  const resetCreateForm = () => {
    setSectionTitle("");
    setParagraphs([""]);
    setSignature("");
    setFile(null);
  };

  const handleCreate = async () => {
    const payload = {
      sectionTitle,
      paragraphs,
      signature,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));

    if (file) {
      formData.append("file", file);
    }

    try {
      await createOurStory(formData).unwrap();
      toast.success("Created successfully");
      resetCreateForm();
      setCreateOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const handleEditOpen = (section: IOurStoryData) => {
    setEditId(section._id);
    setEditSectionTitle(section.sectionTitle);
    setEditParagraphs(section.paragraphs);
    setEditSignature(section.signature);
    setEditCurrentImage(section.founderImage);
    setEditFile(null);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    const payload = {
      sectionTitle: editSectionTitle,
      paragraphs: editParagraphs,
      signature: editSignature,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));

    if (editFile) {
      formData.append("file", editFile);
    }

    try {
      await updateOurStory({
        id: editId,
        formData,
      }).unwrap();

      toast.success("Updated successfully");
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOurStory(id).unwrap();
      toast.success("Deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Our Story</h1>

        {!sections && (
          <Button onClick={() => setCreateOpen(true)}>
            <ImagePlus className="w-4 h-4 mr-1" />
            Add Section
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section._id}>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold">{section.sectionTitle}</h2>

                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {p}
                    </p>
                  ))}

                  <p className="font-medium">{section.signature}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditOpen(section)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(section._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {section.founderImage && (
                <div className="mt-4">
                  <Image
                    src={section.founderImage}
                    alt="story"
                    width={500}
                    height={300}
                    className="rounded-lg w-44 object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Our Story</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Section title"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
          />

          <ParagraphFields
            paragraphs={paragraphs}
            setParagraphs={setParagraphs}
          />

          <Input
            placeholder="Signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />

          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <DialogFooter>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Our Story</DialogTitle>
          </DialogHeader>

          <Input
            value={editSectionTitle}
            onChange={(e) => setEditSectionTitle(e.target.value)}
          />

          <ParagraphFields
            paragraphs={editParagraphs}
            setParagraphs={setEditParagraphs}
          />

          <Input
            value={editSignature}
            onChange={(e) => setEditSignature(e.target.value)}
          />

          <Input
            type="file"
            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
          />

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
