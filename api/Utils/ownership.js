import { HandleERROR } from "vanta-api";
import Company from "../Models/companyMd.js";
import Contract from "../Models/contractMd.js";
import ClassTemplate from "../Models/classTemplateMd.js";

// جلوگیری از اینکه کاربر A به شرکت/قرارداد/تمپلیت کاربر B اشاره کند.
// اگر id خالی باشد (فیلد اختیاری) چیزی چک نمی‌شود.

export const assertCompanyOwned = async (companyId, userId) => {
  if (!companyId) return;
  const ok = await Company.exists({ _id: companyId, createdBy: userId });
  if (!ok) throw new HandleERROR("شرکت یافت نشد", 404);
};

export const assertContractOwned = async (contractId, userId) => {
  if (!contractId) return;
  const ok = await Contract.exists({ _id: contractId, teacher: userId });
  if (!ok) throw new HandleERROR("قرارداد یافت نشد", 404);
};

export const assertTemplateOwned = async (templateId, userId) => {
  if (!templateId) return;
  const ok = await ClassTemplate.exists({ _id: templateId, teacher: userId });
  if (!ok) throw new HandleERROR("الگوی کلاس یافت نشد", 404);
};