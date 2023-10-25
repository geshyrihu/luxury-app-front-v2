/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PresupuestoEditionImagesComponent } from './presupuesto-edition-images.component';

describe('PresupuestoEditionImagesComponent', () => {
  let component: PresupuestoEditionImagesComponent;
  let fixture: ComponentFixture<PresupuestoEditionImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestoEditionImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresupuestoEditionImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
