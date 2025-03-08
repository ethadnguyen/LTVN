import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function timeSince(date: string | Date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  let interval = seconds / 31536000; // Số giây trong 1 năm

  if (interval > 1) {
    return Math.floor(interval) + ' năm trước';
  }

  interval = seconds / 2592000; // Số giây trong 1 tháng
  if (interval > 1) {
    return Math.floor(interval) + ' tháng trước';
  }

  interval = seconds / 86400; // Số giây trong 1 ngày
  if (interval > 1) {
    return Math.floor(interval) + ' ngày trước';
  }

  interval = seconds / 3600; // Số giây trong 1 giờ
  if (interval > 1) {
    return Math.floor(interval) + ' giờ trước';
  }

  interval = seconds / 60; // Số giây trong 1 phút
  if (interval > 1) {
    return Math.floor(interval) + ' phút trước';
  }

  if (seconds < 10) return 'vừa xong';

  return Math.floor(seconds) + ' giây trước';
}

// Hàm format ngày giờ đầy đủ
export function formatDateTime(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Hàm format ngày
export function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
