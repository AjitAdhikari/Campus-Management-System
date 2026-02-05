import { Component, OnInit } from '@angular/core';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { FeeService } from 'src/app/services/fee.service';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {
  pendingFees: any[] = [];
  walletBalance: number = 0;
  showWalletModal: boolean = false;
  paymentAmount: number = 0;
  userId: string = '';
  isProcessingPayment: boolean = false; // Prevent duplicate submissions

  constructor(private feeService: FeeService) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadFeesData();
  }

  loadUserData(): void {
    const userDetails = StorageHelper.getLocalStorageItem('_user_details');
    if (userDetails) {
      const user = JSON.parse(userDetails);
      this.userId = user.id;
      this.walletBalance = parseFloat(user.fees) || 0;
    }
  }

  loadFeesData(): void {
    if (!this.userId) return;

    this.feeService.getFees(this.userId).subscribe({
      next: (response: any) => {
        const fees = response.data || [];

        // Sync wallet balance from server response
        if (response.wallet_balance !== undefined) {
          this.walletBalance = response.wallet_balance;

          // Update localStorage to keep it in sync for headers/other components
          const userDetails = StorageHelper.getLocalStorageItem('_user_details');
          if (userDetails) {
            const user = JSON.parse(userDetails);
            user.fees = this.walletBalance;
            StorageHelper.setLocalStorageItem('_user_details', JSON.stringify(user));
          }
        }

        console.log('Loaded fees data:', fees); // Debug log

        this.pendingFees = fees.map((fee: any) => ({
          semester: fee.semester,
          feeStatus: fee.status || 'Pending',
          totalAmount: parseFloat(fee.total_fee || 0),
          amountPay: parseFloat(fee.amount_paid || 0),
          balancedAmount: parseFloat(fee.due_amount || 0),
          paidDate: fee.latest_payment_date
        }));

        console.log('Processed pending fees:', this.pendingFees); // Debug log
      },
      error: () => {
        this.pendingFees = [];
      }
    });
  }

  openWalletPayment(): void {
    if (!this.pendingFees || this.pendingFees.length === 0) {
      alert('No fee records to process.');
      return;
    }
    this.paymentAmount = this.pendingFees.reduce((sum, fee) => sum + (fee.balancedAmount || 0), 0);
    this.showWalletModal = true;
  }

  closeWalletModal(): void {
    this.showWalletModal = false;
    this.paymentAmount = 0;
  }

  getTotalDue(): number {
    return this.pendingFees.reduce((sum, fee) => sum + (fee.balancedAmount || 0), 0);
  }

  confirmPayment(): void {
    if (this.isProcessingPayment) {
      return; // Prevent double submission
    }

    if (this.paymentAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    const totalDue = this.getTotalDue();

    if (this.paymentAmount > totalDue) {
      alert('Payment amount cannot exceed the due amount!');
      return;
    }

    if (this.walletBalance < this.paymentAmount) {
      alert('Insufficient wallet balance!');
      return;
    }

    this.isProcessingPayment = true;
    const previousBalance = this.walletBalance;
    const paidAmount = this.paymentAmount; // Store payment amount before modal closes

    const paymentData = {
      user_id: this.userId,
      semester: this.pendingFees[0]?.semester,
      payment_date: new Date().toISOString().split('T')[0],
      amount: this.paymentAmount
    };

    console.log('Sending payment data:', paymentData); // Debug log

    this.feeService.createFeeDetail(paymentData).subscribe({
      next: (response: any) => {
        this.isProcessingPayment = false;
        if (response.new_wallet_balance !== undefined) {
          this.walletBalance = response.new_wallet_balance;

          // Update localStorage to persist wallet balance
          const userDetails = StorageHelper.getLocalStorageItem('_user_details');
          if (userDetails) {
            const user = JSON.parse(userDetails);
            user.fees = this.walletBalance;
            StorageHelper.setLocalStorageItem('_user_details', JSON.stringify(user));
          }
        }
        this.closeWalletModal();
        this.loadFeesData();
      },
      error: (error) => {
        this.isProcessingPayment = false;
        this.walletBalance = previousBalance;
        console.error('Payment error:', error);
        const errorMessage = error.error?.error || 'Payment failed to process. Please try again.';
        alert(errorMessage);
      }
    });
  }

}
