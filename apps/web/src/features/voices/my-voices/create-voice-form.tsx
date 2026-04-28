"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "nextjs-toploader/app";
import { ROUTES } from "@/constants";
import { CreateVoiceInputT, createVoiceSchema } from "@/schema/voices.schema";
import { VoiceCategoryEnum, VoiceGenderEnum } from "@repo/db";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useCreateVoiceMutation } from "@/services/voices/mutations";

const CreateVoiceForm = () => {
  const router = useRouter();
  const {
    mutate: createVoiceMutation,
    isPending: loading,
    error: createVoiceError,
  } = useCreateVoiceMutation();
  const form = useForm<CreateVoiceInputT>({
    resolver: zodResolver(createVoiceSchema),
    defaultValues: {
      name: "",
      category: VoiceCategoryEnum.CUSTOM,
      language: "en",
      gender: VoiceGenderEnum.FEMALE,
      isPublic: false,
      description: "",
      accent: "",
    },
  });

  function onSubmit(data: CreateVoiceInputT) {
    console.log(data);
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {createVoiceError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {createVoiceError?.message}
        </div>
      )}

      <div className="space-y-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name" className="text-foreground/70">
                Name
              </FieldLabel>
              <Input
                {...field}
                id="voice-name"
                aria-invalid={fieldState.invalid}
                placeholder="My custom voice"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="space-y-2">
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="voice-desc" className="text-foreground/70">
                Description
              </FieldLabel>
              <Textarea
                {...field}
                id="voice-desc"
                rows={2}
                placeholder="A warm, expressive voice..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Category</FieldLabel>
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={VoiceCategoryEnum.CUSTOM}>Custom</SelectItem>
                    <SelectItem value={VoiceCategoryEnum.CLONED}>Cloned</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <div className="space-y-2">
          <Controller
            name="language"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Language</FieldLabel>
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <div className="space-y-2">
          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Gender</FieldLabel>
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <div className="space-y-2">
          <Controller
            name="accent"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="voice-accent">Accent</FieldLabel>
                <Input {...field} id="voice-accent" placeholder="e.g. american" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2">
        <Controller
          name="isPublic"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="voice-public" className="text-sm font-normal">
                {" "}
                Make voice public
              </FieldLabel>
              <Switch
                id="voice-public"
                checked={field.value}
                onCheckedChange={(value) => field.onChange(value)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Create voice"}
      </Button>
    </form>
  );
};

export default CreateVoiceForm;
