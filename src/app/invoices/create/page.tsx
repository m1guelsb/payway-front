import type React from "react";
import { InvoiceForm } from "./InvoiceForm";

export default function CreateInvoicePage() {
  return (
    <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">New Invoice</h1>
        <p className="text-gray-400">
          Fill out the form below to create a new invoice.
        </p>
      </div>

      <InvoiceForm />
    </div>
  );
}
