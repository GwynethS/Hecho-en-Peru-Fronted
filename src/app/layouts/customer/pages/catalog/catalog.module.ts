import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CatalogDetailComponent } from './pages/catalog-detail/catalog-detail.component';
import { MaterialModule } from '../../../../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ProductsService } from '../../../admin/pages/products/products.service';

@NgModule({
  declarations: [
    CatalogComponent,
    CatalogDetailComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    RatingModule
  ],
  providers: [
    ProductsService
  ]
})
export class CatalogModule { }
