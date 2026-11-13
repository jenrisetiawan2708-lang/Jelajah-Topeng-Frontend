import "server-only";
import { cache } from "react";
import { getDashboardSummaryDTO } from "@/lib/dal";
import { getRecordsDTO } from "@/lib/records";
import { getRefundsDTO } from "@/lib/refunds";

export const getSummary = cache(() => getDashboardSummaryDTO());
export const getAllRecords = cache((userId: string) => getRecordsDTO(userId));
export const getAllRefunds = cache((userId: string) => getRefundsDTO(userId));
