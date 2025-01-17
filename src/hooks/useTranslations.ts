import { DEFAULT_TRANSLATIONS, Translations } from "@/constants/translations";
import { useCallback } from "react";

export const useTranslations = (customTranslations?: Translations) => {
  const translations = customTranslations || DEFAULT_TRANSLATIONS;

  const t = useCallback((key: string): string => {
    return key.split('.').reduce((obj, i) => obj[i], translations as any) || key;
  }, [translations]);

  return { t };
};