"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type InvoiceFormData = {
  amount: number;
  description: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardholderName: string;
}

export async function createInvoiceAction(formData: InvoiceFormData) {
  const cookiesStore = await cookies();
  const apiKey = cookiesStore.get("apiKey")?.value;

  const response = await fetch("http://app:8080/invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey as string,
    },
    body: JSON.stringify({
      amount: formData.amount,
      description: formData.description,
      card_number: formData.cardNumber,
      expiry_month: formData.expiryMonth,
      expiry_year: formData.expiryYear,
      cvv: formData.cvv,
      cardholder_name: formData.cardholderName,
      payment_type: "credit_card",
    }),
  });

  if (!response.ok) {
    console.error("Error creating invoice:", await response.text());
    throw new Error("Failed to create invoice");
  }

  const data = await response.json();

  revalidateTag(`accounts/${apiKey}/invoices`);
  revalidateTag(`accounts/${apiKey}/invoices/${data.id}`)

  redirect("/invoices");
}
