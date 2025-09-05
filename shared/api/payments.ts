import { useEffect, useState } from "react";
import { db } from "./config";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useAuthContext } from "../hooks/context/useAuthContext";
import type { Payment } from "@/data/Payments/interfaces";

export const useUserPayments = (): Payment[] => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      setPayments([]);
      return;
    }

    const sortPayments = (payments: Payment[]) => {
      return payments.sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime());
    };

    const paymentsCollection = collection(db, "payments");
    const userPaymentsQuery = query(paymentsCollection, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(userPaymentsQuery, (snapshot) => {
      const paymentList: Payment[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];

      setPayments(sortPayments(paymentList));
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return payments;
};

// Function to add a new payment/subscription
export const addPayment = async (
  paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt" | "userId">,
  userId: string,
): Promise<void> => {
  try {
    if (!userId) throw new Error("User ID is required");

    const paymentsCollection = collection(db, "payments");
    const newPayment = {
      ...paymentData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(paymentsCollection, newPayment);
  } catch (error) {
    console.error("Error adding payment:", error);
    throw error;
  }
};

// Function to get a single payment by ID
export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  try {
    const paymentsCollection = collection(db, "payments");
    const paymentDocRef = doc(paymentsCollection, paymentId);
    const paymentDoc = await getDoc(paymentDocRef);

    if (!paymentDoc.exists()) {
      throw new Error(`Payment with ID ${paymentId} not found`);
    }

    return {
      id: paymentDoc.id,
      ...paymentDoc.data(),
    } as Payment;
  } catch (error) {
    console.error("Error getting payment:", error);
    throw error;
  }
};

// Function to update payment
export const updatePayment = async (paymentId: string, updateData: Partial<Payment>): Promise<void> => {
  try {
    const paymentsCollection = collection(db, "payments");
    const paymentDocRef = doc(paymentsCollection, paymentId);

    await updateDoc(paymentDocRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

// Function to remove payment
export const removePayment = async (paymentId: string): Promise<void> => {
  try {
    const paymentsCollection = collection(db, "payments");
    const paymentDocRef = doc(paymentsCollection, paymentId);
    await deleteDoc(paymentDocRef);
  } catch (error) {
    console.error("Error removing payment:", error);
    throw error;
  }
};

// Function to mark payment as paid and calculate next payment date
export const markPaymentAsPaid = async (paymentId: string): Promise<void> => {
  try {
    // Fetch the payment data to get the cycle information
    const payment = await getPaymentById(paymentId);
    const nextDate = calculateNextPaymentDate(payment.cycle, new Date(payment.nextPaymentDate));

    await updatePayment(paymentId, {
      isPaid: true,
      lastPaymentDate: new Date().toISOString().split("T")[0],
      nextPaymentDate: nextDate,
    });
  } catch (error) {
    console.error("Error marking payment as paid:", error);
    throw error;
  }
};

// Helper function to calculate next payment date
export const calculateNextPaymentDate = (cycle: Payment["cycle"], fromDate: Date = new Date()): string => {
  const date = new Date(fromDate);

  switch (cycle) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date.toISOString().split("T")[0];
};

// Helper function to get days until next payment
export const getDaysUntilPayment = (nextPaymentDate: string): number => {
  const today = new Date();
  const paymentDate = new Date(nextPaymentDate);
  const diffTime = paymentDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to check if payment is paid for the current period
export const isPaymentPaidForCurrentPeriod = (payment: Payment): boolean => {
  if (!payment.isPaid || !payment.lastPaymentDate) {
    return false;
  }

  const today = new Date();
  const lastPayment = new Date(payment.lastPaymentDate);

  switch (payment.cycle) {
    case "weekly": {
      // Check if both dates are in the same week
      const todayWeekStart = new Date(today);
      todayWeekStart.setDate(today.getDate() - today.getDay());
      todayWeekStart.setHours(0, 0, 0, 0);

      const lastPaymentWeekStart = new Date(lastPayment);
      lastPaymentWeekStart.setDate(lastPayment.getDate() - lastPayment.getDay());
      lastPaymentWeekStart.setHours(0, 0, 0, 0);

      return todayWeekStart.getTime() === lastPaymentWeekStart.getTime();
    }

    case "monthly": {
      // Check if both dates are in the same month and year
      return today.getFullYear() === lastPayment.getFullYear() && today.getMonth() === lastPayment.getMonth();
    }

    case "quarterly": {
      // Check if both dates are in the same quarter and year
      const todayQuarter = Math.floor(today.getMonth() / 3);
      const lastPaymentQuarter = Math.floor(lastPayment.getMonth() / 3);

      return today.getFullYear() === lastPayment.getFullYear() && todayQuarter === lastPaymentQuarter;
    }

    case "yearly": {
      // Check if both dates are in the same year
      return today.getFullYear() === lastPayment.getFullYear();
    }

    default:
      return false;
  }
};
