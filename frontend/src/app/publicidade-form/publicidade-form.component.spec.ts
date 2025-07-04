import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicidadeFormComponent } from './publicidade-form.component';

describe('PublicidadeFormComponent', () => {
  let component: PublicidadeFormComponent;
  let fixture: ComponentFixture<PublicidadeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicidadeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicidadeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
