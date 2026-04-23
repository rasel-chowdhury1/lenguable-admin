/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { toast } from "sonner";
import {
  useCreateHeroMutation,
  useGetHeroQuery,
  useUpdateHeroMutation,
  useDeleteHeroMutation,
} from "@/redux/features/heroApi";
import Image from "next/image";

interface FormFieldsProps {
  badgeVal: string;
  setBadgeVal: (v: string) => void;
  titleVal: string;
  setTitleVal: (v: string) => void;
  descVal: string;
  setDescVal: (v: string) => void;
  cardTitleVal: string;
  setCardTitleVal: (v: string) => void;
  cardDescVal: string;
  setCardDescVal: (v: string) => void;
  filesVal: File[];
  setFilesVal: (v: File[]) => void;
}

const FormFields = ({
  badgeVal,
  setBadgeVal,
  titleVal,
  setTitleVal,
  descVal,
  setDescVal,
  cardTitleVal,
  setCardTitleVal,
  cardDescVal,
  setCardDescVal,
  filesVal,
  setFilesVal,
}: FormFieldsProps) => (
  <div className="space-y-4 mt-2">
    <div className="space-y-1">
      <label className="text-sm font-medium">Badge</label>
      <Input
        placeholder="e.g. Transforming life through speaking"
        value={badgeVal}
        onChange={(e) => setBadgeVal(e.target.value)}
      />
    </div>
    <div className="space-y-1">
      <label className="text-sm font-medium">Title</label>
      <Input
        placeholder="e.g. Connect with Native English Tutors"
        value={titleVal}
        onChange={(e) => setTitleVal(e.target.value)}
      />
    </div>
    <div className="space-y-1">
      <label className="text-sm font-medium">Description</label>
      <Textarea
        placeholder="Enter description..."
        rows={3}
        value={descVal}
        onChange={(e) => setDescVal(e.target.value)}
      />
    </div>
    <div className="space-y-1">
      <label className="text-sm font-medium">Card Title</label>
      <Input
        placeholder="e.g. 100% Teaching Live"
        value={cardTitleVal}
        onChange={(e) => setCardTitleVal(e.target.value)}
      />
    </div>
    <div className="space-y-1">
      <label className="text-sm font-medium">Card Description</label>
      <Input
        placeholder="e.g. We matched the student and native English-speaking tutors"
        value={cardDescVal}
        onChange={(e) => setCardDescVal(e.target.value)}
      />
    </div>
    <div className="space-y-1">
      <label className="text-sm font-medium">
        Images <span className="text-muted-foreground text-xs">(max 3)</span>
      </label>
      <div className="flex items-center gap-2 border rounded-md px-3 py-2">
        <ImagePlus className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input
          type="file"
          multiple
          accept="image/*"
          className="border-0 p-0 shadow-none text-sm"
          onChange={(e) => {
            const selected = Array.from(e.target.files || []);
            if (selected.length > 3) {
              toast.error("Maximum 3 images allowed");
              e.target.value = "";
              return;
            }
            setFilesVal(selected);
          }}
        />
      </div>
      {filesVal.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {filesVal.length}/3 file(s) selected
        </p>
      )}
    </div>
  </div>
);

export default function Hero() {
  const { data, isLoading } = useGetHeroQuery(undefined);
  const [createHero, { isLoading: isCreating }] = useCreateHeroMutation();
  const [updateHero, { isLoading: isUpdating }] = useUpdateHeroMutation();
  const [deleteHero, { isLoading: isDeleting }] = useDeleteHeroMutation();

  const hero = data?.data;

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [badge, setBadge] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardDesc, setCardDesc] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editBadge, setEditBadge] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCardTitle, setEditCardTitle] = useState("");
  const [editCardDesc, setEditCardDesc] = useState("");
  const [editFiles, setEditFiles] = useState<File[]>([]);

  const handleCreate = async () => {
    if (!badge || !title || !description || !cardTitle || !cardDesc) {
      toast.error("All fields are required");
      return;
    }
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        badge,
        title,
        description,
        cardTitle,
        cardDescription: cardDesc,
      }),
    );
    files.forEach((file) => formData.append("files", file));
    try {
      await createHero(formData).unwrap();
      toast.success("Hero created successfully");
      setBadge("");
      setTitle("");
      setDescription("");
      setCardTitle("");
      setCardDesc("");
      setFiles([]);
      setCreateOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create hero");
    }
  };

  const handleEditOpen = () => {
    setEditBadge(hero?.badge || "");
    setEditTitle(hero?.title || "");
    setEditDescription(hero?.description || "");
    setEditCardTitle(hero?.cardTitle || "");
    setEditCardDesc(hero?.cardDescription || "");
    setEditFiles([]);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (
      !editBadge ||
      !editTitle ||
      !editDescription ||
      !editCardTitle ||
      !editCardDesc
    ) {
      toast.error("All fields are required");
      return;
    }
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        badge: editBadge,
        title: editTitle,
        description: editDescription,
        cardTitle: editCardTitle,
        cardDescription: editCardDesc,
      }),
    );
    editFiles.forEach((file) => formData.append("files", file));
    try {
      await updateHero({ id: hero?._id, data: formData }).unwrap();
      toast.success("Hero updated successfully");
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update hero");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHero(hero?._id).unwrap();
      toast.success("Hero deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete hero");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Hero Section</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your homepage hero content
          </p>
        </div>
        {!hero && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Hero
          </Button>
        )}
      </div>

      {/* HERO CARD */}
      {hero ? (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Text + Actions */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs sm:text-sm">
                  {hero.badge}
                </span>
                <h2 className="text-lg sm:text-xl font-bold leading-snug">
                  {hero.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {hero.description}
                </p>
                <div className="pt-2 border-t mt-2">
                  <p className="text-sm font-medium">{hero.cardTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {hero.cardDescription}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditOpen}
                  disabled={isUpdating}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Images */}
            {hero.images?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">
                  Images ({hero.images.length}/3)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hero.images.map((img: string, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden h-44 sm:h-52 bg-gray-100"
                    >
                      <Image
                        src={img}
                        alt={`Hero image ${index + 1}`}
                        width={400}
                        height={208}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-20 border rounded-xl">
          <ImagePlus className="w-10 h-10 mb-3 text-muted-foreground/40" />
          <p className="font-medium">No hero section created yet</p>
          <p className="text-sm mt-1">
            Click &quot;Create Hero&quot; to get started
          </p>
        </div>
      )}

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="w-[95vw] max-w-lg rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Hero Section</DialogTitle>
          </DialogHeader>
          <FormFields
            badgeVal={badge}
            setBadgeVal={setBadge}
            titleVal={title}
            setTitleVal={setTitle}
            descVal={description}
            setDescVal={setDescription}
            cardTitleVal={cardTitle}
            setCardTitleVal={setCardTitle}
            cardDescVal={cardDesc}
            setCardDescVal={setCardDesc}
            filesVal={files}
            setFilesVal={setFiles}
          />
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleCreate}
              disabled={isCreating}
            >
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
        <DialogContent className="w-[95vw] max-w-lg rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hero Section</DialogTitle>
          </DialogHeader>
          <FormFields
            badgeVal={editBadge}
            setBadgeVal={setEditBadge}
            titleVal={editTitle}
            setTitleVal={setEditTitle}
            descVal={editDescription}
            setDescVal={setEditDescription}
            cardTitleVal={editCardTitle}
            setCardTitleVal={setEditCardTitle}
            cardDescVal={editCardDesc}
            setCardDescVal={setEditCardDesc}
            filesVal={editFiles}
            setFilesVal={setEditFiles}
          />
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
