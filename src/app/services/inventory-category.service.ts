import { Injectable } from '@angular/core';
import { EInventoryCategory } from '../enums/categoria-inventario.enum';

@Injectable({
  providedIn: 'root',
})
export class InventoryCategoryService {
  inventoryCategory: EInventoryCategory;

  getInventoryCategory() {
    return this.inventoryCategory;
  }
  setInventoryCategory(value: EInventoryCategory) {
    this.inventoryCategory = value;
  }
}
