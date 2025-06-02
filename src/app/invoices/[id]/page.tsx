import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { StatusBadge } from "../../../components/StatusBadge";

export async function getInvoice(id: string) {
  const cookiesStore = await cookies();
  const apiKey = cookiesStore.get("apiKey")?.value;
  const response = await fetch(`http://app:8080/invoice/${id}`, {
    headers: {
      "X-API-KEY": apiKey as string,
    },
    cache: 'force-cache',
    next: {
      tags: [`accounts/${apiKey}/invoices/${id}`]
    }
  });
  return response.json();
}

export default async function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoiceData = await getInvoice(id);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white"
          asChild
        >
          <Link href="/invoices">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Invoice {id}</h1>
            <StatusBadge status={invoiceData.status} />
          </div>
          <p className="text-gray-400">
            Created on {new Date(invoiceData.created_at).toLocaleDateString()}
          </p>
        </div>

        <Button variant="outline" className="bg-[#2a3749] border-gray-700">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1e293b] border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Invoice Information
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Invoice ID</span>
              <span className="text-white font-medium">{invoiceData.id}</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-medium">
                {invoiceData.amount}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Creation Date</span>
              <span className="text-white font-medium">
                {new Date(invoiceData.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between pb-2">
              <span className="text-gray-400">Description</span>
              <span className="text-white font-medium">
                {invoiceData.description}
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1e293b] border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Payment Method
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Type</span>
              <span className="text-white font-medium">
                {invoiceData.payment_type === "credit_card"
                  ? "Credit Card"
                  : "Boleto"}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Last Digits</span>
              <span className="text-white font-medium">
                {invoiceData.card_last_digits}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}