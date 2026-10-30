import { useState } from "react";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { Input } from "./Input";
import { Select } from "./Select";
import { SearchInput } from "./SearchInput";
import { Avatar } from "./Avatar";
import { GpaMeter } from "./GpaMeter";
import { TableSkeletonRows } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";
import { Drawer } from "./Drawer";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";
import { Edit2, Trash2 } from "lucide-react";
import { Field } from "./Field";

export function PrimitivesPreview() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { showToast } = useToast();

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl font-semibold text-ink border-b border-rule pb-2">
        UI Primitives Preview
      </h2>

      {/* Buttons */}
      <section className="space-y-3">
        <h3 className="font-serif text-xl font-semibold text-ink">Buttons</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="primary" isLoading>Loading</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-3">
        <h3 className="font-serif text-xl font-semibold text-ink">Icon Buttons</h3>
        <div className="flex items-center gap-2">
          <IconButton aria-label="Edit student" variant="default">
            <Edit2 className="h-4 w-4" />
          </IconButton>
          <IconButton aria-label="Delete student" variant="destructive">
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </section>

      {/* Fields & Inputs */}
      <section className="space-y-3">
        <h3 className="font-serif text-xl font-semibold text-ink">Inputs & Fields</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="First name" helperText="Legal given name">
            {(fieldProps) => <Input placeholder="Ada" {...fieldProps} />}
          </Field>
          <Field label="Email" error="Enter a valid email address">
            {(fieldProps) => <Input defaultValue="invalid-email" hasError {...fieldProps} />}
          </Field>
          <Field label="Phone number" optional>
            {(fieldProps) => <Input placeholder="+1 555-0100" {...fieldProps} />}
          </Field>
          <Field label="Course">
            {(fieldProps) => (
              <Select
                options={[
                  { label: "Computer Science", value: "cs" },
                  { label: "Mechanical Engineering", value: "me" },
                ]}
                {...fieldProps}
              />
            )}
          </Field>
        </div>
      </section>

      {/* Search & GPA & Avatar */}
      <section className="space-y-3">
        <h3 className="font-serif text-xl font-semibold text-ink">Data Elements</h3>
        <SearchInput value={searchVal} onChange={setSearchVal} />
        <div className="flex items-center gap-6 pt-2">
          <Avatar firstName="Ada" lastName="Lovelace" />
          <Avatar firstName="Alan" lastName="Turing" size="large" />
          <GpaMeter gpa={3.85} />
          <GpaMeter gpa={null} />
        </div>
      </section>

      {/* Modals & Toasts */}
      <section className="space-y-3">
        <h3 className="font-serif text-xl font-semibold text-ink">Dialogs & Overlays</h3>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
            Open Drawer
          </Button>
          <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
            Open Confirm Dialog
          </Button>
          <Button
            variant="secondary"
            onClick={() => showToast("Saved Ada Lovelace")}
          >
            Trigger Toast
          </Button>
        </div>

        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title="Add student"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setDrawerOpen(false)}>
                Save student
              </Button>
            </div>
          }
        >
          <p className="text-ink-2">Drawer body contents.</p>
        </Drawer>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          studentName="Ada Lovelace"
          onConfirm={() => {
            setConfirmOpen(false);
            showToast("Deleted Ada Lovelace");
          }}
        />
      </section>

      {/* Empty States & Pagination */}
      <section className="space-y-3">
        <h3 className="font-serif text-xl font-semibold text-ink">States & Navigation</h3>
        <EmptyState variant="no-matches" onAction={() => setSearchVal("")} />
        <Pagination
          page={1}
          limit={10}
          total={42}
          totalPages={5}
          onPageChange={() => {}}
        />
        <TableSkeletonRows rows={2} />
      </section>
    </div>
  );
}
