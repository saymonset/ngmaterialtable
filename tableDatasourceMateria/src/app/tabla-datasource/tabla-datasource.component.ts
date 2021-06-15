import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import {Observable, BehaviorSubject, of, merge} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, finalize, tap} from "rxjs/operators";
import { UserService } from '../services/user.service';
import { User, UserData } from '../interfaces/users.interfaces';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { UserDatasourceComponent } from '../user-datasource/user-datasource.component';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { fromEvent } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-tabla-datasource',
  templateUrl: './tabla-datasource.component.html',
  styleUrls: ['./tabla-datasource.component.css']
})
export class TablaDatasourceComponent implements OnInit ,  AfterViewInit {

  selection = new SelectionModel<User>(true, []);

  dataSource!: UserDatasourceComponent;
  displayedColumns: string[] = [ 'select','id','email', 'first_name', 'last_name', 'avatar'];

 
  // get refereence to paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort();

  @ViewChild('input', { static: true }) input!: ElementRef;

  data! : UserData
  users:        User[] = [];
  offset: number=0;

  courseId:number=0;
    filter:string='';
    sortEmail:string='asc';
    pageIndex:number=2;
    pageSize:number=2;

  @Output() page = new EventEmitter<PageEvent>();
 


  constructor(private userService: UserService) { 

    }

   

ngOnInit(): void {

// this.course = this.route.snapshot.data["course"];
this.dataSource = new UserDatasourceComponent(this.userService);
this.dataSource.loadLessons(0, '', 'asc', 0, 3);

}


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSelectedPage() {
    const numSelected = this.selection.selected.length;
    const page = this.dataSource.paginator.pageSize;
    let endIndex: number;
	// First check whether data source length is greater than current page index multiply by page size.
	// If yes then endIdex will be current page index multiply by page size.
	// If not then select the remaining elements in current page only.
    if (this.dataSource.data.length > (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize) {
      endIndex = (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize;
    } else {
      // tslint:disable-next-line:max-line-length
      endIndex = this.dataSource.data.length - (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize);
    }
    console.log(endIndex);
    return numSelected === endIndex;
  }

  
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
   selectRows() {
    // tslint:disable-next-line:max-line-length
    let endIndex: number;
    // tslint:disable-next-line:max-line-length
    if (this.dataSource.data.length > (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize) {
      endIndex = (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize;
    } else {
      // tslint:disable-next-line:max-line-length
      endIndex = this.dataSource.data.length;
    }
	
    for (let index = (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize); index < endIndex; index++) {
      this.selection.select(this.dataSource.data[index]);
    }
  }

  logSelection() {
    this.selection.selected.forEach(s => {
      console.log(JSON.stringify(s));
    });
  }


ngAfterViewInit(): void {

  this.dataSource.paginator = this.paginator;

//console.log('xx='+this.paginator.pageIndex, this.paginator.pageSize);

//this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

fromEvent(this.input.nativeElement,'keyup')
.pipe(
debounceTime(150),
distinctUntilChanged(),
tap(() => {
this.paginator.pageIndex = 0;
 console.log('pasandddoooooooooooooo');
this.loadLessonsPage();
})
)
.subscribe();
 


}



loadLessonsPage() {
this.dataSource.loadLessons(
0,  '', 'email', 
     this.paginator.pageIndex, this.paginator.pageSize);
}

getNext(event: PageEvent) {
this.offset = event.pageSize * event.pageIndex
console.log(this.offset);
// call your api function here with the offset
}

onRowClicked(row:User){
console.log('Row clicked: ', row);
}

onPageFired(event){
  let {pageIndex,pageSize} = event;
  console.log(event);
  console.log({pageIndex,pageSize});
  this.dataSource.loadLessons(0, '', 'asc', pageSize, pageIndex);
}

}
