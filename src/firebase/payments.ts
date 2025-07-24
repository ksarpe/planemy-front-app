import { useEffect, useState } from "react";
import { db } from "./config";
import { collection, onSnapshot, addDoc, query, where, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export interface Payment {
  id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: "weekly" | "monthly" | "quarterly" | "yearly";
  category: "subscription" | "utility" | "insurance" | "loan" | "rent" | "other";
  description?: string;
  nextPaymentDate: string;
  lastPaymentDate?: string;
  isActive: boolean;
  isPaid: boolean;
  autoRenew: boolean;
  reminderDays: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useUserPayments = (): Payment[] => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { user } = useAuth();

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
export const addPayment = async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, userId: string): Promise<void> => {
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
export const markPaymentAsPaid = async (paymentId: string, payment: Payment): Promise<void> => {
  try {
    const nextDate = calculateNextPaymentDate(payment.cycle, new Date());
    
    await updatePayment(paymentId, {
      isPaid: true,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      nextPaymentDate: nextDate,
    });
  } catch (error) {
    console.error("Error marking payment as paid:", error);
    throw error;
  }
};

// Function to toggle payment active status
export const togglePaymentStatus = async (paymentId: string, isActive: boolean): Promise<void> => {
  try {
    await updatePayment(paymentId, { isActive });
  } catch (error) {
    console.error("Error toggling payment status:", error);
    throw error;
  }
};

// Helper function to calculate next payment date
export const calculateNextPaymentDate = (cycle: Payment['cycle'], fromDate: Date = new Date()): string => {
  const date = new Date(fromDate);
  
  switch (cycle) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  
  return date.toISOString().split('T')[0];
};

// Helper function to get days until next payment
export const getDaysUntilPayment = (nextPaymentDate: string): number => {
  const today = new Date();
  const paymentDate = new Date(nextPaymentDate);
  const diffTime = paymentDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
