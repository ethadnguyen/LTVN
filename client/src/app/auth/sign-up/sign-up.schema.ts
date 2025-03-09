import { z } from 'zod';

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email là bắt buộc' })
    .email({ message: 'Email không hợp lệ' }),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    .max(50, { message: 'Mật khẩu không được vượt quá 50 ký tự' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Mật khẩu xác nhận là bắt buộc' })
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    .max(50, { message: 'Mật khẩu không được vượt quá 50 ký tự' }),
  name: z
    .string()
    .min(1, { message: 'Tên là bắt buộc' })
    .max(50, { message: 'Tên không được vượt quá 50 ký tự' }),
  phone: z
    .string()
    .min(1, { message: 'Số điện thoại là bắt buộc' })
    .max(15, { message: 'Số điện thoại không được vượt quá 15 ký tự' }),
});
