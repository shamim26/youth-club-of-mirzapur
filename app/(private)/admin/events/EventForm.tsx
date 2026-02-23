"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { YouthEvent } from "@/types/events";
import { createEvent, updateEvent } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const eventFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  event_date: z.date().optional(),
  location: z.string().optional(),
  is_published: z.boolean().default(false),
  dynamicData: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .default([]),
  polls: z
    .array(
      z.object({
        dbId: z.string().optional(),
        question: z.string().min(1, "Question is required"),
        options: z
          .array(
            z.object({
              dbId: z.string().optional(),
              text: z.string().min(1, "Option is required"),
            }),
          )
          .min(2, "At least 2 options required"),
      }),
    )
    .default([]),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function EventForm({ event }: { event?: YouthEvent }) {
  const router = useRouter();

  // Convert generic JSON object back to array of key-value pairs
  const initialDynamicData = event?.dynamic_data
    ? Object.entries(event.dynamic_data).map(([key, value]) => ({
        key,
        value: String(value),
      }))
    : [];

  // Assuming event object doesn't pass polls back down yet, we init as empty.
  // We'll leave poll editing to a separate system or keep it simple for now (adding new polls on edit).
  // For robustness, usually you'd fetch polls if editing, but the UI requested is "poll creation option".
  const form = useForm<EventFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(eventFormSchema) as any,
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      event_date: event?.event_date ? new Date(event.event_date) : undefined,
      location: event?.location || "",
      is_published: event?.is_published ?? false,
      dynamicData: initialDynamicData,
      polls:
        event?.polls?.map((p) => ({
          dbId: p.id,
          question: p.question,
          options: p.options.map((o) => ({ dbId: o.id, text: o.text })),
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "dynamicData",
    control: form.control,
  });

  const {
    fields: pollFields,
    append: appendPoll,
    remove: removePoll,
  } = useFieldArray({
    name: "polls",
    control: form.control,
  });

  const onSubmit = async (data: EventFormValues) => {
    // Convert array back to generic JSON object
    const dynamic_data = data.dynamicData.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, unknown>,
    );

    const payload = {
      title: data.title,
      description: data.description || "",
      event_date: data.event_date ? data.event_date.toISOString() : null,
      location: data.location || "",
      is_published: data.is_published,
      dynamic_data,
      polls: data.polls.map((p) => ({
        id: p.dbId,
        question: p.question,
        options: p.options.map((o) => ({ id: o.dbId, text: o.text })),
      })),
    };

    if (event) {
      const { success, error } = await updateEvent(
        event.id,
        payload as unknown as Parameters<typeof updateEvent>[1],
      );
      if (success) {
        toast.success("Event updated successfully");
        router.push("/admin/events");
      } else {
        toast.error(error || "Failed to update event");
      }
    } else {
      const { success, error } = await createEvent(
        payload as unknown as Parameters<typeof createEvent>[0],
      );
      if (success) {
        toast.success("Event created successfully");
        router.push("/admin/events");
      } else {
        toast.error(error || "Failed to create event");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Annual Grand Feast" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Details about the event..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="event_date"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2.5">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "d MMMM yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Main Hall" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-md border p-4 bg-muted/20">
          <div>
            <h3 className="mb-1 text-lg font-medium">Dynamic Fields</h3>
            <p className="text-sm text-muted-foreground">
              Add any custom key-value pairs specific for this event (e.g.,
              &quot;Dress Code&quot;, &quot;Menu Type&quot;).
            </p>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <FormField
                control={form.control}
                name={`dynamicData.${index}.key`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className={index !== 0 ? "sr-only" : ""}>
                      Key
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Menu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`dynamicData.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-2">
                    <FormLabel className={index !== 0 ? "sr-only" : ""}>
                      Value
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Biriyani" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ key: "", value: "" })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Field
          </Button>
        </div>

        {/* Polls Section */}
        <div className="space-y-4 rounded-md border p-4 bg-muted/10">
          <div>
            <h3 className="mb-1 text-lg font-medium">Event Polls</h3>
            <p className="text-sm text-muted-foreground">
              Add interactive polls for the event (e.g. &quot;What dish to
              bring?&quot;).
            </p>
          </div>

          {pollFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border rounded-md space-y-4 bg-background"
            >
              <div className="flex items-start justify-between">
                <input
                  type="hidden"
                  {...form.register(`polls.${index}.dbId` as const)}
                />
                <FormField
                  control={form.control}
                  name={`polls.${index}.question`}
                  render={({ field: qField }) => (
                    <FormItem className="flex-1 mr-4">
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. What activity should we do first?"
                          {...qField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="mt-8"
                  onClick={() => removePoll(index)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>

              {/* Options for this poll */}
              <FormField
                control={form.control}
                name={`polls.${index}.options`}
                render={({ field: optionsField }) => {
                  return (
                    <div className="space-y-2 pl-4 border-l-2">
                      <FormLabel>Options</FormLabel>
                      {optionsField.value.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <Input
                            placeholder={`Option ${optIndex + 1}`}
                            value={opt.text}
                            onChange={(e) => {
                              const newOptions = [...optionsField.value];
                              newOptions[optIndex] = {
                                ...newOptions[optIndex],
                                text: e.target.value,
                              };
                              optionsField.onChange(newOptions);
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newOptions = optionsField.value.filter(
                                (_, i) => i !== optIndex,
                              );
                              optionsField.onChange(newOptions);
                            }}
                          >
                            <Trash className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          optionsField.onChange([
                            ...optionsField.value,
                            { text: "" },
                          ]);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Option
                      </Button>
                      <FormMessage />
                    </div>
                  );
                }}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendPoll({
                question: "",
                options: [{ text: "" }, { text: "" }],
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Poll
          </Button>
        </div>

        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 focus:ring-primary text-primary"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Publish Event</FormLabel>
                <FormDescription>
                  Make this event visible to the public. You can keep it drafted
                  while adding polls or photos later.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {(!event || form.formState.isDirty) && (
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Saving..."
              : event
                ? "Update Event"
                : "Create Event"}
          </Button>
        )}
      </form>
    </Form>
  );
}
