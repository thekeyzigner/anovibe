"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/site";

async function guard() {
  if (!isAdminEmail((await auth())?.user?.email)) throw new Error("Forbidden");
}

export async function setReportStatus(id: string, status: "REVIEWED" | "DISMISSED", _fd?: FormData) {
  await guard();
  await prisma.report.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

// Deleting the message also deletes its reports.
export async function removeReported(id: string, _fd?: FormData) {
  await guard();
  const r = await prisma.report.findUnique({ where: { id }, select: { messageId: true } });
  if (r) await prisma.message.delete({ where: { id: r.messageId } });
  revalidatePath("/admin");
}
