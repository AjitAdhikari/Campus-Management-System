import { Component, OnInit } from '@angular/core';
import { FeeService } from 'src/app/services/fee.service';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {
  pendingDues: number = 0;
  lastPayment: { amount: number, date: string } | null = null;
  totalPaidYear: number = 0;
  pendingFees: any[] = [];
  isLoading: boolean = false;
  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;

  constructor(private feeService: FeeService) { }

  ngOnInit(): void {
    this.loadFeesData();
  }

  loadFeesData(): void {
    this.isLoading = true;
    // For the invoice-style view we populate mock invoice data here.
    // In a real app this should come from `FeeService` or an API.
    setTimeout(() => {
      this.pendingFees = [
        {
          invoiceNumber: '644984994',
          feeStatus: 'Partial Payment',
          totalAmount: 336698,
          amountPay: 74563,
          balancedAmount: 262135,
          invoiceDate: '2023-12-02 10:05:13'
        },
        {
          invoiceNumber: '745002171',
          feeStatus: 'Partial Payment',
          totalAmount: 336698,
          amountPay: 54756,
          balancedAmount: 281942,
          invoiceDate: '2023-12-02 10:05:40'
        }
      ];
      this.pendingDues = this.pendingFees.reduce((s, inv) => s + (inv.balancedAmount || 0), 0);
      this.isLoading = false;
    }, 300);

    this.lastPayment = { amount: 500.00, date: 'Oct 2025' };
    this.totalPaidYear = 3500.00;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.pendingFees.length / this.pageSize));
  }

  get displayedFees(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.pendingFees.slice(start, start + this.pageSize);
  }

  createRange(n: number): any[] {
    return new Array(n);
  }

  viewInvoice(invoice: any): void {
    // Replace with real navigation to invoice detail
    console.log('View invoice', invoice);
    alert('View invoice: ' + invoice.invoiceNumber);
  }

  viewAllInvoices(event: Event): void {
    event.preventDefault();
    console.log('View all invoices');
    alert('Redirect to invoice list (placeholder)');
  }

  goTo(action: 'first' | 'prev' | 'next' | 'last', event: Event): void {
    event.preventDefault();
    if (action === 'first') this.currentPage = 1;
    else if (action === 'prev') this.currentPage = Math.max(1, this.currentPage - 1);
    else if (action === 'next') this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
    else if (action === 'last') this.currentPage = this.totalPages;
  }

  changePage(page: number, event?: Event): void {
    if (event) event.preventDefault();
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  proceedToPayment(): void {
    if (!this.pendingFees || this.pendingFees.length === 0) {
      alert('No invoices to process.');
      return;
    }
    const count = this.displayedFees.length;
    const ok = confirm(`Process payment for ${count} invoice(s) shown on this page?`);
    if (!ok) return;

    // UI-only: mark displayed invoices as paid
    const start = (this.currentPage - 1) * this.pageSize;
    for (let i = 0; i < this.displayedFees.length; i++) {
      const idx = start + i;
      const inv = this.pendingFees[idx];
      if (inv) {
        inv.feeStatus = 'Paid';
        inv.amountPay = inv.totalAmount;
        inv.balancedAmount = 0;
      }
    }
    // Recalculate dues
    this.pendingDues = this.pendingFees.reduce((s, inv) => s + (inv.balancedAmount || 0), 0);
    alert(`Processed payment for ${count} invoice(s) (UI-only).`);
  }
  
}
