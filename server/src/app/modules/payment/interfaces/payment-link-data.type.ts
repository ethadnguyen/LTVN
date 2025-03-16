type TransactionType = {
  reference: string; // Mã tham chiếu của giao dịch
  amount: number; // Số tiền chuyển khoản của giao dịch
  accountNumber: string; // Số tài khoản nhận tiền (là số tài khoản của kênh thanh toán)
  description: string; // Nội dung chuyển khoản
  transactionDateTime: string; // Ngày giờ giao dịch
  virtualAccountName: string | null; // Tên chủ tài khoản ảo
  virtualAccountNumber: string | null; // Số tài khoản ảo
  counterAccountBankId: string | null; // ID ngân hàng đối ứng
  counterAccountBankName: string | null; // Tên ngân hàng đối ứng
  counterAccountName: string | null; // Tên chủ tài khoản đối ứng
  counterAccountNumber: string | null; // Số tài khoản đối ứng
};

export type PaymentLinkDataType = {
  id: string; // ID link thanh toán
  orderCode: number; // Mã đơn hàng
  amount: number; // Số tiền của đơn hàng
  amountPaid: number; // Số tiền đã thanh toán
  amountRemaining: number; // Số tiền cần thanh toán còn lại
  status: string; // Trạng thái của link thanh toán
  createdAt: string; // Thời gian tạo link thanh toán
  transactions: TransactionType[]; // Danh sách các giao dịch của link thanh toán
  cancellationReason: string | null; // Lý do hủy link thanh toán nếu liên kết đã bị hủy/
  canceledAt: string | null; // Thời gian hủy link thanh toán
};
