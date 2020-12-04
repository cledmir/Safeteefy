import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Guardian} from '../../models/guardian';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpDataService} from '../../services/http-data.service';
import {Router} from '@angular/router';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-guardians',
  templateUrl: './guardians.component.html',
  styleUrls: ['./guardians.component.css']
})
export class GuardiansComponent implements OnInit, AfterViewInit {
  GuardianData: Guardian;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'username', 'firstName', 'lastName', 'email', 'address', 'gender', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private httpDataService: HttpDataService, private router: Router) {
    this.GuardianData = {} as Guardian;
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.getAllGuardians();
  }
  ngAfterViewInit(): void{
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getAllGuardians(): void{
    this.httpDataService.getAllGuardians().subscribe((response: any) => {
      this.dataSource = response;
    });
  }

  setCurrentGuardian(id): void{
    this.httpDataService.getGuardian(id).subscribe((response: any) => {
      window.sessionStorage.setItem('id', id);
      window.sessionStorage.setItem('guardian', response.username);
      this.router.navigate(['']).then(() => null);
    });
  }

}
