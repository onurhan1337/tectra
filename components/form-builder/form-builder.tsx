"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { FormField } from "@/lib/types";
import { SortableFieldItem } from "./sortable-field-item";
import { FieldTypeList } from "./field-type-list";
import { FieldProperties } from "./field-properties";

interface FormBuilderProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
}

export function FormBuilderContainer({
  fields,
  onFieldsChange,
}: FormBuilderProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg border bg-background shadow-sm">
      <FormBuilder fields={fields} onFieldsChange={onFieldsChange} />
    </div>
  );
}

function FormBuilder({ fields, onFieldsChange }: FormBuilderProps) {
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(
    null
  );
  const selectedField =
    selectedFieldIndex !== null ? fields[selectedFieldIndex] : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddField = (fieldType: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType as any,
      label: `New ${fieldType} field`,
      placeholder: `Enter ${fieldType}...`,
    };

    if (fieldType === "select" || fieldType === "radio") {
      (newField as any).options = ["Option 1", "Option 2", "Option 3"];
    }

    const newFields = [...fields, newField];
    onFieldsChange(newFields);
    setSelectedFieldIndex(newFields.length - 1);
  };

  const handleFieldUpdate = useCallback(
    (index: number, updatedField: Partial<FormField>) => {
      const newFields = [...fields];
      newFields[index] = { ...newFields[index], ...updatedField } as FormField;
      onFieldsChange(newFields);
    },
    [fields, onFieldsChange]
  );

  const handleFieldDelete = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    onFieldsChange(newFields);
    setSelectedFieldIndex(null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      const newFields = arrayMove(fields, oldIndex, newIndex);
      onFieldsChange(newFields);

      if (selectedFieldIndex === oldIndex) {
        setSelectedFieldIndex(newIndex);
      }
    }
  };

  const handleSelectedFieldChange = useCallback(
    (updatedField: Partial<FormField>) => {
      if (selectedFieldIndex !== null) {
        handleFieldUpdate(selectedFieldIndex, updatedField);
      }
    },
    [selectedFieldIndex, handleFieldUpdate]
  );

  return (
    <div className="grid h-full w-full grid-cols-12 divide-x divide-border">
      <div className="col-span-12 flex flex-col overflow-hidden md:col-span-3">
        <div className="flex h-14 shrink-0 items-center border-b bg-muted/5 px-4">
          <h2 className="font-semibold">Field Types</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <FieldTypeList onAddField={handleAddField} />
        </div>
      </div>

      <div className="col-span-12 flex flex-col overflow-hidden md:col-span-6">
        <div className="flex h-14 shrink-0 items-center border-b bg-muted/5 px-4">
          <h2 className="font-semibold">Form Fields</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {fields.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
              <p className="mb-2 text-muted-foreground">Your form is empty</p>
              <p className="text-sm text-muted-foreground">
                Add fields from the panel on the left to get started
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <SortableFieldItem
                      key={field.id}
                      field={field}
                      index={index}
                      isSelected={selectedFieldIndex === index}
                      onClick={() => setSelectedFieldIndex(index)}
                      onDelete={() => handleFieldDelete(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <div className="col-span-12 flex flex-col overflow-hidden md:col-span-3">
        <div className="flex h-14 shrink-0 items-center border-b bg-muted/5 px-4">
          <h2 className="font-semibold">Properties</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {selectedField ? (
            <FieldProperties
              field={selectedField}
              onChange={handleSelectedFieldChange}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              Select a field to edit its properties
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { FormBuilder };
