import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UpdateVoicePayloadT, updateVoiceSchema } from "@/schema/voices.schema";
import {
  VOICE_GENDER_OPTIONS,
  VOICE_LANGUAGE_OPTIONS,
  VoiceGenderEnum,
  VoiceLanguageEnum,
} from "@/constants/voice";
import { VoiceT } from "@/services/voices/types";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateVoiceMutation } from "@/services/voices/mutations";
import { useState } from "react";

interface EditVoiceFormProps {
  onUpdated: (voice: VoiceT) => void;
  voice: VoiceT;
}

const EditVoiceForm = ({ voice, onUpdated }: EditVoiceFormProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const {
    mutate: updateVoiceMutation,
    isPending: isUpdateVoiceLoading,
    error: updateVoiceError,
  } = useUpdateVoiceMutation();
  const form = useForm<UpdateVoicePayloadT>({
    resolver: zodResolver(updateVoiceSchema),
    defaultValues: {
      id: voice.id,
      name: voice.name || "",
      language: voice.language || VoiceLanguageEnum.ENGLISH,
      gender: voice.gender || VoiceGenderEnum.NEUTRAL,
      isPublic: voice.isPublic || false,
      description: voice.description || "",
      accent: voice.accent || "",
    },
  });

  const onSubmit = (data: UpdateVoicePayloadT) => {
    updateVoiceMutation(data, {
      onSuccess: (response) => {
        onUpdated(response.data as VoiceT);
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
        }, 3000);
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {updateVoiceError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {updateVoiceError?.message}
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
            name="language"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Language</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_LANGUAGE_OPTIONS.filter((option) => option.value !== "all").map(
                      (option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Controller
          name="gender"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Gender</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_GENDER_OPTIONS.filter((option) => option.value !== "all").map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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
      <Button type="submit" className="w-full" disabled={isUpdateVoiceLoading}>
        {isUpdateVoiceLoading && <Loader2 className="size-4 animate-spin" />}
        {isSaved ? (
          <>
            <Check className="size-3.5" />
            Saved
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
};

export default EditVoiceForm;
