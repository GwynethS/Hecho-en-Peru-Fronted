import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Customer } from './models/customer';
import { CustomersService } from './customers.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, OnDestroy {
  customerSearchForm: FormGroup;
  customers: Customer[] = [];
  dataSource = new MatTableDataSource<Customer>();
  
  searchAttempted: boolean = false;

  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(FormGroupDirective)
  private customerSearchFormDir!: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
  ) {
    this.customerSearchForm = this.fb.group({
      id: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadCustomers(): void {
    const subscription = this.customersService
      .getCustomers()
      .subscribe({
        next: (customers) => {
          this.searchAttempted = false;
          this.customers = customers || [];
          this.dataSource.data = this.customers;
        },
        error: (err) => {
          this.dataSource.data = [];
          this.searchAttempted = true;
          console.error('Failed to load customers', err);
        }
      });
    this.subscriptions.push(subscription);
  }

  onSearch(): void {
    if (this.customerSearchForm.invalid) {
      this.customerSearchForm.markAllAsTouched();
    } else {
      const subscription = this.customersService
        .getSearchCustomerById(this.customerSearchForm.value.id)
        .subscribe({
          next: (customer) => {
            this.searchAttempted = false;
              this.customers = [customer];
              this.dataSource.data = this.customers;
          },
          error: (err) => {
            this.dataSource.data = [];
            this.searchAttempted = true;
            console.error(`Failed to load customer with ID ${this.customerSearchForm.value.id}`, err);
          }
        });
      this.subscriptions.push(subscription);
    }
  }

  onClean(): void {
    this.searchAttempted = false;
    this.customerSearchFormDir.resetForm();
    this.loadCustomers();
  }
}
