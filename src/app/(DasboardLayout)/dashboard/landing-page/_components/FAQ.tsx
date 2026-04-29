"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2, Plus, X } from "lucide-react";
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
import { toast } from "sonner";

import {
  useCreateFAQMutation,
  useDeleteFAQMutation,
  useGetAllFAQQuery,
  useUpdateFAQMutation,
} from "@/redux/features/faqApi";

interface IFaqItem {
  question: string;
  answer: string;
}

interface IFAQ {
  _id: string;
  sectionTitle: string;
  sectionSubtitle: string;
  faqs: IFaqItem[];
}

export default function FAQ() {
  const { data, isLoading, refetch } = useGetAllFAQQuery(undefined);

  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const faqs: IFAQ[] = data?.data || [];

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSubtitle, setSectionSubtitle] = useState("");
  const [faqItems, setFaqItems] = useState<IFaqItem[]>([
    { question: "", answer: "" },
  ]);

  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editFaqItems, setEditFaqItems] = useState<IFaqItem[]>([
    { question: "", answer: "" },
  ]);

  // CREATE FUNCTIONS
  const addFaq = () => {
    setFaqItems([...faqItems, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  const updateFaqItem = (
    index: number,
    field: keyof IFaqItem,
    value: string,
  ) => {
    const updated = [...faqItems];
    updated[index][field] = value;
    setFaqItems(updated);
  };

  // EDIT FUNCTIONS
  const addEditFaq = () => {
    setEditFaqItems([...editFaqItems, { question: "", answer: "" }]);
  };

  const removeEditFaq = (index: number) => {
    setEditFaqItems(editFaqItems.filter((_, i) => i !== index));
  };

  const updateEditFaqItem = (
    index: number,
    field: keyof IFaqItem,
    value: string,
  ) => {
    const updated = [...editFaqItems];
    updated[index][field] = value;
    setEditFaqItems(updated);
  };

  const resetCreateForm = () => {
    setSectionTitle("");
    setSectionSubtitle("");
    setFaqItems([{ question: "", answer: "" }]);
  };

  const resetEditForm = () => {
    setEditId("");
    setEditTitle("");
    setEditSubtitle("");
    setEditFaqItems([{ question: "", answer: "" }]);
  };

  const handleCreate = async () => {
    try {
      await createFAQ({
        sectionTitle,
        sectionSubtitle,
        faqs: faqItems,
      }).unwrap();

      toast.success("FAQ created successfully");
      resetCreateForm();
      setOpen(false);
      refetch();
    } catch {
      toast.error("Failed to create FAQ");
    }
  };

  const handleEditOpen = (item: IFAQ) => {
    setEditId(item._id);
    setEditTitle(item.sectionTitle);
    setEditSubtitle(item.sectionSubtitle);
    setEditFaqItems(item.faqs);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await updateFAQ({
        id: editId,
        data: {
          sectionTitle: editTitle,
          sectionSubtitle: editSubtitle,
          faqs: editFaqItems,
        },
      }).unwrap();

      toast.success("FAQ updated successfully");
      resetEditForm();
      setEditOpen(false);
      refetch();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFAQ(id).unwrap();
      toast.success("Deleted successfully");
      refetch();
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
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">FAQ</h1>

        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <div className="space-y-4">
        {faqs.map((item) => (
          <Card key={item._id}>
            <CardContent className="p-5">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold">{item.sectionTitle}</h2>
                  <p className="text-sm text-muted-foreground">
                    {item.sectionSubtitle}
                  </p>

                  <div className="mt-3 space-y-3">
                    {item.faqs.map((f, i) => (
                      <div key={i}>
                        <p className="font-medium">{f.question}</p>
                        <p className="text-sm text-muted-foreground">
                          {f.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CREATE MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create FAQ</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Section Title"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
          />

          <Input
            placeholder="Section Subtitle"
            value={sectionSubtitle}
            onChange={(e) => setSectionSubtitle(e.target.value)}
          />

          {faqItems.map((f, i) => (
            <div key={i} className="space-y-2 border p-3 rounded-md">
              <Input
                placeholder="Question"
                value={f.question}
                onChange={(e) => updateFaqItem(i, "question", e.target.value)}
              />

              <Textarea
                placeholder="Answer"
                value={f.answer}
                onChange={(e) => updateFaqItem(i, "answer", e.target.value)}
              />

              {faqItems.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFaq(i)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          ))}

          <Button variant="outline" onClick={addFaq}>
            Add More FAQ
          </Button>

          <DialogFooter>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Section Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <Input
            placeholder="Section Subtitle"
            value={editSubtitle}
            onChange={(e) => setEditSubtitle(e.target.value)}
          />

          {editFaqItems.map((f, i) => (
            <div key={i} className="space-y-2 border p-3 rounded-md">
              <Input
                placeholder="Question"
                value={f.question}
                onChange={(e) =>
                  updateEditFaqItem(i, "question", e.target.value)
                }
              />

              <Textarea
                placeholder="Answer"
                value={f.answer}
                onChange={(e) => updateEditFaqItem(i, "answer", e.target.value)}
              />

              {editFaqItems.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeEditFaq(i)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          ))}

          <Button variant="outline" onClick={addEditFaq}>
            Add More FAQ
          </Button>

          <DialogFooter>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
