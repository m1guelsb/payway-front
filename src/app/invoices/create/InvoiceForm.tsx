"use client";

import { CreditCard } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { createInvoiceAction } from "./create-invoice-action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const invoiceSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0.01, "Amount must be at least 0.01"),
  description: z.string().min(1, "Description is required"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export function InvoiceForm() {

   const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      amount: 0.01,
      description: "This is a test invoice",
      cardNumber: "1111111111111111",
      expiryDate: "12/25",
      cvv: "123",
      cardholderName: "Name Surname",
    },
  });

  async function onSubmit(data: InvoiceFormValues) {
    try {
      await createInvoiceAction({
        amount: data.amount,
        description: data.description,
        cardNumber: data.cardNumber,
        expiryMonth: parseInt(data.expiryDate.split('/')[0], 10),
        expiryYear: parseInt(data.expiryDate.split('/')[1], 10),
        cvv: data.cvv,
        cardholderName: data.cardholderName,
      });
      alert("Invoice created successfully!");
      reset();
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div >
            <label htmlFor="amount" className="text-gray-300 block">
              Value
            </label>
            <Input
              id="amount"
              type="number"
              step={0.01}
              min={0}
              placeholder="0.00"
              className="bg-[#2a3749] border-gray-700 text-white placeholder-gray-400"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <span className="text-red-400 text-sm">{errors.amount.message}</span>
            )}
          </div>

          <div >
            <label htmlFor="description" className="text-gray-300 block">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter a description for the invoice"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-red-400 text-sm">{errors.description.message}</span>
            )}
          </div>
        </div>

        <div className="bg-[#232f43] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Credit Card Details
          </h2>

          <div className="space-y-4">
            <div >
              <label htmlFor="cardNumber" className="text-gray-300 block">
                Number
              </label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="0000000000000000"
                  maxLength={16}
                  className="bg-[#2a3749] border-gray-700 pl-10 text-white placeholder-gray-400"
                  {...register("cardNumber")}
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.cardNumber && (
                <span className="text-red-400 text-sm">{errors.cardNumber.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div >
                <label htmlFor="expiryDate" className="text-gray-300 block">
                  Expiry Date
                </label>
                <Input
                  id="expiryDate"
                  placeholder="MM/AA"
                  className="bg-[#2a3749] border-gray-700 text-white placeholder-gray-400"
                  {...register("expiryDate")}
                />
                {errors.expiryDate && (
                  <span className="text-red-400 text-sm">{errors.expiryDate.message}</span>
                )}
              </div>

              <div >
                <label htmlFor="cvv" className="text-gray-300 block">
                  CVV
                </label>
                <Input
                  id="cvv"
                  placeholder="123"
                  className="bg-[#2a3749] border-gray-700 text-white placeholder-gray-400"
                  {...register("cvv")}
                />
                {errors.cvv && (
                  <span className="text-red-400 text-sm">{errors.cvv.message}</span>
                )}
              </div>
            </div>

            <div >
              <label htmlFor="cardholderName" className="text-gray-300 block">
                Cardholder Name
              </label>
              <Input
                id="cardholderName"
                className="bg-[#2a3749] border-gray-700 text-white placeholder-gray-400"
                {...register("cardholderName")}
              />
              {errors.cardholderName && (
                <span className="text-red-400 text-sm">{errors.cardholderName.message}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          className="bg-[#2a3749] border-gray-700"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>
    </form>
  );
}
