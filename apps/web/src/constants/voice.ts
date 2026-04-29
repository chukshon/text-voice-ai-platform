export enum VoiceCategoryEnum {
  PREMADE = "PREMADE",
  CLONED = "CLONED",
  CUSTOM = "CUSTOM",
}

export enum VoiceGenderEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NEUTRAL = "NEUTRAL",
}

export enum VoiceLanguageEnum {
  ENGLISH = "en",
  SPANISH = "es",
  FRENCH = "fr",
  GERMAN = "de",
  JAPANESE = "ja",
}

export const VOICE_CATEGORY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Premade", value: VoiceCategoryEnum.PREMADE },
  { label: "Cloned", value: VoiceCategoryEnum.CLONED },
  { label: "Custom", value: VoiceCategoryEnum.CUSTOM },
];

export const VOICE_GENDER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Male", value: VoiceGenderEnum.MALE },
  { label: "Female", value: VoiceGenderEnum.FEMALE },
  { label: "Neutral", value: VoiceGenderEnum.NEUTRAL },
];

export const VOICE_LANGUAGE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "English", value: VoiceLanguageEnum.ENGLISH },
  { label: "Spanish", value: VoiceLanguageEnum.SPANISH },
  { label: "French", value: VoiceLanguageEnum.FRENCH },
  { label: "German", value: VoiceLanguageEnum.GERMAN },
  { label: "Japanese", value: VoiceLanguageEnum.JAPANESE },
];
