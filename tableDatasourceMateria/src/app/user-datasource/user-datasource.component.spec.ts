import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDatasourceComponent } from './user-datasource.component';

describe('UserDatasourceComponent', () => {
  let component: UserDatasourceComponent;
  let fixture: ComponentFixture<UserDatasourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDatasourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
